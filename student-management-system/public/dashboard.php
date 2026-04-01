<?php
// public/dashboard.php
require_once __DIR__ . "/../config/db.php";
require_auth();
$token = csrf_token();

$adminName = $_SESSION["admin_name"] ?? "Admin";
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SMS • Dashboard</title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body class="app">
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="logo">
        <img src="assets/img/logo.png" alt="Logo" class="logo-img" />

        <div>
          <strong>Mehdi GHINE</strong>
          <span class="muted">Admin Panel</span>
        </div>
      </div>
    </div>

    <nav class="nav">
      <button class="nav-item active" data-view="home">
        <span>Overview</span>
      </button>
      <button class="nav-item" data-view="students">
        <span>Students</span>
      </button>
      <button class="nav-item" data-view="subjects">
        <span>Subjects</span>
      </button>
      <button class="nav-item" data-view="grades">
        <span>Grades</span>
      </button>
    </nav>

    <div class="sidebar-bottom">
      <div class="mini-profile">
        <div class="avatar"><?= htmlspecialchars(strtoupper(substr($adminName,0,1))) ?></div>
        <div>
          <div class="name"><?= htmlspecialchars($adminName) ?></div>
          <div class="muted">Session secured</div>
        </div>
      </div>
      <a class="btn ghost" href="logout.php">Logout</a>
    </div>
  </aside>

  <main class="main">
    <header class="topbar">
      <div class="search">
        <input id="globalSearch" placeholder="Search students, subjects..." />
        <span class="kbd">CTRL K</span>
      </div>
      <div class="chips">
        <span class="chip" id="clockChip">⏳</span>
        <span class="chip glow">Live</span>
      </div>
    </header>

    <section id="viewHost" class="view-host">
      <!-- Injected by JS with smooth transitions -->
    </section>

    <div id="modalHost"></div>
    <div id="toastHost" class="toast-host"></div>
  </main>

  <script>
    window.SMS_CSRF = <?= json_encode($token) ?>;
  </script>
  <script src="assets/js/app.js"></script>
</body>
</html>
