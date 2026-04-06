<!DOCTYPE html>
<html>
<head>
  <title>Smart Hotel</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<nav>
  <a href="index.php">Home</a>
  <a href="rooms.php">Rooms</a>
  <a href="contact.php">Contact</a>

  <?php if(isset($_SESSION['user'])): ?>
    <a href="profile.php">Profile</a>
    <a href="logout.php">Logout</a>
  <?php else: ?>
    <a href="login.php">Login</a>
  <?php endif; ?>
</nav>
