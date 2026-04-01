<?php
// api/grades.php
require_once __DIR__ . "/../config/db.php";
require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $mode = (string)($_GET["mode"] ?? "");

  if ($mode === "overview") {
    $counts = [
      "students" => (int)$pdo->query("SELECT COUNT(*) c FROM students")->fetch()["c"],
      "subjects" => (int)$pdo->query("SELECT COUNT(*) c FROM subjects")->fetch()["c"],
      "grades"   => (int)$pdo->query("SELECT COUNT(*) c FROM grades")->fetch()["c"],
    ];

    $recent = $pdo->query("
      SELECT g.id, s.full_name, s.student_code, sub.title AS subject_title, g.grade, g.created_at
      FROM grades g
      JOIN students s ON s.id = g.student_id
      JOIN subjects sub ON sub.id = g.subject_id
      ORDER BY g.created_at DESC
      LIMIT 8
    ")->fetchAll();

    json_out(["ok" => true, "counts" => $counts, "recent" => $recent]);
  }

  // list grades
  $stmt = $pdo->query("
    SELECT g.id, g.grade, g.note, g.created_at,
           s.id as student_id, s.full_name, s.student_code,
           sub.id as subject_id, sub.title as subject_title, sub.code as subject_code
    FROM grades g
    JOIN students s ON s.id = g.student_id
    JOIN subjects sub ON sub.id = g.subject_id
    ORDER BY g.created_at DESC
    LIMIT 800
  ");
  json_out(["ok" => true, "data" => $stmt->fetchAll()]);
}

verify_csrf();
$input = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === "POST") {
  $student_id = (int)($input["student_id"] ?? 0);
  $subject_id = (int)($input["subject_id"] ?? 0);
  $grade = (float)($input["grade"] ?? -1);
  $note = trim((string)($input["note"] ?? ""));

  if ($student_id<=0 || $subject_id<=0) json_out(["ok"=>false,"error"=>"Student and subject required"], 422);
  if ($grade < 0 || $grade > 20) json_out(["ok"=>false,"error"=>"Grade must be between 0 and 20"], 422);

  $stmt = $pdo->prepare("
    INSERT INTO grades (student_id, subject_id, grade, note)
    VALUES (?, ?, ?, NULLIF(?, ''))
    ON DUPLICATE KEY UPDATE grade=VALUES(grade), note=VALUES(note)
  ");
  $stmt->execute([$student_id, $subject_id, $grade, $note]);
  json_out(["ok" => true]);
}

if ($method === "DELETE") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) json_out(["ok" => false, "error" => "Invalid id"], 422);

  $stmt = $pdo->prepare("DELETE FROM grades WHERE id=?");
  $stmt->execute([$id]);
  json_out(["ok" => true]);
}

json_out(["ok" => false, "error" => "Method not allowed"], 405);
