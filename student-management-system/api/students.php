<?php
// api/students.php
require_once __DIR__ . "/../config/db.php";
require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $q = trim((string)($_GET["q"] ?? ""));
  if ($q !== "") {
    $stmt = $pdo->prepare("
      SELECT * FROM students
      WHERE full_name LIKE ? OR student_code LIKE ? OR email LIKE ?
      ORDER BY id DESC
      LIMIT 500
    ");
    $like = "%$q%";
    $stmt->execute([$like, $like, $like]);
  } else {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY id DESC LIMIT 500");
  }
  json_out(["ok" => true, "data" => $stmt->fetchAll()]);
}

verify_csrf();
$input = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === "POST") {
  $student_code = trim((string)($input["student_code"] ?? ""));
  $full_name = trim((string)($input["full_name"] ?? ""));
  $email = trim((string)($input["email"] ?? ""));
  $phone = trim((string)($input["phone"] ?? ""));
  $level = trim((string)($input["level"] ?? ""));
  $status = ($input["status"] ?? "ACTIVE") === "INACTIVE" ? "INACTIVE" : "ACTIVE";

  if (!$student_code || !$full_name) {
    json_out(["ok" => false, "error" => "Student code and full name required"], 422);
  }

  $stmt = $pdo->prepare("
    INSERT INTO students (student_code, full_name, email, phone, level, status)
    VALUES (?, ?, NULLIF(?,''), NULLIF(?,''), NULLIF(?,''), ?)
  ");
  try {
    $stmt->execute([$student_code, $full_name, $email, $phone, $level, $status]);
    json_out(["ok" => true]);
  } catch (Throwable $e) {
    json_out(["ok" => false, "error" => "Insert failed (maybe duplicate code/email)."], 400);
  }
}

if ($method === "PUT") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) json_out(["ok" => false, "error" => "Invalid id"], 422);

  $full_name = trim((string)($input["full_name"] ?? ""));
  $email = trim((string)($input["email"] ?? ""));
  $phone = trim((string)($input["phone"] ?? ""));
  $level = trim((string)($input["level"] ?? ""));
  $status = ($input["status"] ?? "ACTIVE") === "INACTIVE" ? "INACTIVE" : "ACTIVE";

  $stmt = $pdo->prepare("
    UPDATE students
    SET full_name=?, email=NULLIF(?,''), phone=NULLIF(?,''), level=NULLIF(?,''), status=?
    WHERE id=?
  ");
  try {
    $stmt->execute([$full_name, $email, $phone, $level, $status, $id]);
    json_out(["ok" => true]);
  } catch (Throwable $e) {
    json_out(["ok" => false, "error" => "Update failed (maybe duplicate email)."], 400);
  }
}

if ($method === "DELETE") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) json_out(["ok" => false, "error" => "Invalid id"], 422);

  $stmt = $pdo->prepare("DELETE FROM students WHERE id=?");
  $stmt->execute([$id]);
  json_out(["ok" => true]);
}

json_out(["ok" => false, "error" => "Method not allowed"], 405);
