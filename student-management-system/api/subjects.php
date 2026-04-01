<?php
// api/subjects.php
require_once __DIR__ . "/../config/db.php";
require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $q = trim((string)($_GET["q"] ?? ""));
  if ($q !== "") {
    $stmt = $pdo->prepare("
      SELECT * FROM subjects
      WHERE title LIKE ? OR code LIKE ?
      ORDER BY id DESC
      LIMIT 500
    ");
    $like = "%$q%";
    $stmt->execute([$like, $like]);
  } else {
    $stmt = $pdo->query("SELECT * FROM subjects ORDER BY id DESC LIMIT 500");
  }
  json_out(["ok" => true, "data" => $stmt->fetchAll()]);
}

verify_csrf();
$input = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === "POST") {
  $code = trim((string)($input["code"] ?? ""));
  $title = trim((string)($input["title"] ?? ""));
  $coefficient = (float)($input["coefficient"] ?? 1);

  if (!$code || !$title) json_out(["ok" => false, "error" => "Code and title required"], 422);

  $stmt = $pdo->prepare("INSERT INTO subjects (code, title, coefficient) VALUES (?, ?, ?)");
  try {
    $stmt->execute([$code, $title, $coefficient]);
    json_out(["ok" => true]);
  } catch (Throwable $e) {
    json_out(["ok" => false, "error" => "Insert failed (maybe duplicate code)."], 400);
  }
}

if ($method === "PUT") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) json_out(["ok" => false, "error" => "Invalid id"], 422);

  $title = trim((string)($input["title"] ?? ""));
  $coefficient = (float)($input["coefficient"] ?? 1);

  $stmt = $pdo->prepare("UPDATE subjects SET title=?, coefficient=? WHERE id=?");
  $stmt->execute([$title, $coefficient, $id]);
  json_out(["ok" => true]);
}

if ($method === "DELETE") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) json_out(["ok" => false, "error" => "Invalid id"], 422);

  $stmt = $pdo->prepare("DELETE FROM subjects WHERE id=?");
  $stmt->execute([$id]);
  json_out(["ok" => true]);
}

json_out(["ok" => false, "error" => "Method not allowed"], 405);
