<?php
/**
 * Registration API Endpoint
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
if (empty($data->firstName) || empty($data->lastName) || 
    empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "All required fields must be filled."
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

// Validate password strength
if (strlen($data->password) < 8) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Password must be at least 8 characters long."
    ));
    exit();
}

try {
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();

    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(array(
            "success" => false,
            "message" => "Email already registered."
        ));
        exit();
    }

    // Insert user
    $query = "INSERT INTO users 
              (first_name, last_name, email, phone, password_hash) 
              VALUES 
              (:first_name, :last_name, :email, :phone, :password_hash)";
    
    $stmt = $db->prepare($query);

    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    // Bind parameters
    $stmt->bindParam(":first_name", $data->firstName);
    $stmt->bindParam(":last_name", $data->lastName);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":password_hash", $password_hash);

    // Execute query
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Registration successful.",
            "user_id" => $db->lastInsertId()
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to register user."
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage()
    ));
}
?>