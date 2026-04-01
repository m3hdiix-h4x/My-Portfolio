<?php
// api/auth.php
require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  json_out(["ok" => false, "error" => "Method not allowed"], 405);
}

verify_csrf();

$input = json_decode(file_get_contents("php://input"), true) ?? [];
$email = trim((string)($input["email"] ?? ""));
$password = (string)($input["password"] ?? "");

if (!$email || !$password) {
  json_out(["ok" => false, "error" => "Email and password required"], 422);
}

$stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM admins WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin["password_hash"])) {
  json_out(["ok" => false, "error" => "Invalid credentials"], 401);
}

$_SESSION["admin_id"] = $admin["id"];
$_SESSION["admin_name"] = $admin["name"];

json_out(["ok" => true, "redirect" => "dashboard.php"]);
