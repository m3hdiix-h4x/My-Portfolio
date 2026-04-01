<?php
// public/index.php
require_once __DIR__ . "/../config/db.php";

if (!empty($_SESSION["admin_id"])) {
  header("Location: dashboard.php");
  exit;
}

$token = csrf_token();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MG • Mehdi GHINE</title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body class="bg">
  <div class="auth-wrap">
    <div class="brand">
      <img src="assets/img/logo.png" alt="Logo" class="logo-img" />

      <div>
        <h1>Student Management System By Mehdi GHINE</h1>
        <p>MADE BY MG • INNOVATOR • STUDENT • CREATOR</p>
      </div>
    </div>

    <div class="card auth-card reveal">
      <h2>Admin Login</h2>
      <p class="muted">Sign in to manage students, subjects, and grades.</p>

      <form id="loginForm" class="form">
        <label>Email</label>
        <input name="email" type="email" placeholder="Ex: ahmed123@gmail.com" required />

        <label>Password</label>
        <input name="password" type="password" placeholder="••••••••••" required />

        <button class="btn primary" type="submit">
          <span class="btn-shine"></span>
          Sign in
        </button>
        <div class="hint">Welcome to my student management system</div>
      </form>
    </div>

    <div id="toastHost" class="toast-host"></div>
  </div>

  <script>
    window.SMS_CSRF = <?= json_encode($token) ?>;
  </script>
  <script src="assets/js/app.js"></script>
</body>
</html>
