<?php
/**
 * Login API Endpoint
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Email and password are required."
    ));
    exit();
}

try {
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();

    // Query to get user
    $query = "SELECT id, first_name, last_name, email, phone, password_hash, role 
              FROM users 
              WHERE email = :email 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($data->password, $row['password_hash'])) {
            http_response_code(200);
            
            // Generate session token (in production, use JWT)
            $token = bin2hex(random_bytes(32));
            
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful.",
                "token" => $token,
                "user" => array(
                    "id" => $row['id'],
                    "firstName" => $row['first_name'],
                    "lastName" => $row['last_name'],
                    "email" => $row['email'],
                    "phone" => $row['phone'],
                    "role" => $row['role']
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid password."
            ));
        }
    } else {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "User not found."
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage()
    ));
}
?><?php
/**
 * Login API Endpoint
 * Enhanced version with JWT, rate limiting, and security improvements
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array(
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ));
    exit();
}

include_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Email and password are required."
    ));
    exit();
}

// Validate email format
if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid email format."
    ));
    exit();
}

// Simple rate limiting (check attempts in last 15 minutes)
$clientIP = $_SERVER['REMOTE_ADDR'];
$email = strtolower(trim($data->email));

try {
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();

    // Check rate limiting
    $rateLimitQuery = "SELECT COUNT(*) as attempts FROM login_attempts 
                       WHERE (ip_address = :ip OR email = :email) 
                       AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)";
    $rateLimitStmt = $db->prepare($rateLimitQuery);
    $rateLimitStmt->bindParam(":ip", $clientIP);
    $rateLimitStmt->bindParam(":email", $email);
    $rateLimitStmt->execute();
    $rateLimit = $rateLimitStmt->fetch(PDO::FETCH_ASSOC);

    if ($rateLimit['attempts'] >= 5) {
        http_response_code(429);
        echo json_encode(array(
            "success" => false,
            "message" => "Too many login attempts. Please try again in 15 minutes."
        ));
        exit();
    }

    // Query to get user
    $query = "SELECT id, first_name, last_name, email, phone, password_hash, role 
              FROM users 
              WHERE email = :email 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (password_verify($data->password, $row['password_hash'])) {
            // Check if password needs rehashing
            if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
                $newHash = password_hash($data->password, PASSWORD_DEFAULT);
                $updateQuery = "UPDATE users SET password_hash = :hash WHERE id = :id";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(":hash", $newHash);
                $updateStmt->bindParam(":id", $row['id']);
                $updateStmt->execute();
            }

            // Update last login
            $updateLoginQuery = "UPDATE users SET last_login = NOW() WHERE id = :id";
            $updateLoginStmt = $db->prepare($updateLoginQuery);
            $updateLoginStmt->bindParam(":id", $row['id']);
            $updateLoginStmt->execute();

            // Generate JWT-like token (simplified)
            $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
            $payload = base64_encode(json_encode([
                'user_id' => $row['id'],
                'email' => $row['email'],
                'role' => $row['role'],
                'exp' => time() + 3600
            ]));
            $secret = 'your-secret-key-change-this'; // Change this!
            $signature = hash_hmac('sha256', "$header.$payload", $secret);
            $token = "$header.$payload.$signature";

            // Clear failed attempts
            $clearQuery = "DELETE FROM login_attempts WHERE email = :email";
            $clearStmt = $db->prepare($clearQuery);
            $clearStmt->bindParam(":email", $email);
            $clearStmt->execute();

            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Login successful.",
                "token" => $token,
                "expiresIn" => 3600,
                "user" => array(
                    "id" => $row['id'],
                    "firstName" => $row['first_name'],
                    "lastName" => $row['last_name'],
                    "email" => $row['email'],
                    "phone" => $row['phone'],
                    "role" => $row['role']
                )
            ));
        } else {
            // Record failed attempt
            $failQuery = "INSERT INTO login_attempts (ip_address, email, attempt_time) 
                         VALUES (:ip, :email, NOW())";
            $failStmt = $db->prepare($failQuery);
            $failStmt->bindParam(":ip", $clientIP);
            $failStmt->bindParam(":email", $email);
            $failStmt->execute();

            http_response_code(401);
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid email or password."
            ));
        }
    } else {
        // Record failed attempt even for non-existent users
        $failQuery = "INSERT INTO login_attempts (ip_address, email, attempt_time) 
                     VALUES (:ip, :email, NOW())";
        $failStmt = $db->prepare($failQuery);
        $failStmt->bindParam(":ip", $clientIP);
        $failStmt->bindParam(":email", $email);
        $failStmt->execute();

        // Same message to prevent user enumeration
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid email or password."
        ));
    }
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred. Please try again later."
    ));
}
?>