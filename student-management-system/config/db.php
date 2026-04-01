<?php
// config/db.php
declare(strict_types=1);

session_start();

$DB_HOST = "localhost";
$DB_NAME = "sms_db";
$DB_USER = "root";
$DB_PASS = ""; // XAMPP default is often empty

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );
} catch (Throwable $e) {
  http_response_code(500);
  echo "Database connection failed.";
  exit;
}

function require_auth(): void {
  if (empty($_SESSION["admin_id"])) {
    header("Location: index.php");
    exit;
  }
}

function json_out(array $data, int $code = 200): void {
  http_response_code($code);
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode($data);
  exit;
}

function csrf_token(): string {
  if (empty($_SESSION["csrf"])) {
    $_SESSION["csrf"] = bin2hex(random_bytes(32));
  }
  return $_SESSION["csrf"];
}

function verify_csrf(): void {
  $h = getallheaders();
  $token = $h["X-CSRF-Token"] ?? $h["x-csrf-token"] ?? "";
  if (!$token || empty($_SESSION["csrf"]) || !hash_equals($_SESSION["csrf"], $token)) {
    json_out(["ok" => false, "error" => "Invalid CSRF token"], 403);
  }
}
