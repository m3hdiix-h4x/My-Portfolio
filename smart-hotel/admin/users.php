<?php
include '../backend/config/database.php';
session_start();
if($_SESSION['role'] != 'admin'){ header("Location: login.html"); exit; }

// Fetch all users
$users = $conn->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);

// Delete user
if(isset($_POST['delete'])){
    $id = $_POST['user_id'];
    $conn->prepare("DELETE FROM users WHERE id=?")->execute([$id]);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Users</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<header>
    <div class="logo">Smart<span>Hotel Admin</span></div>
</header>
<section class="dashboard-container">
<h2>Manage Users</h2>
<table border="1" style="width:100%; margin-top:20px; text-align:center;">
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Role</th>
    <th>Action</th>
</tr>
<?php foreach($users as $u){ ?>
<tr>
<td><?= $u['id'] ?></td>
<td><?= $u['name'] ?></td>
<td><?= $u['email'] ?></td>
<td><?= $u['phone'] ?></td>
<td><?= $u['role'] ?></td>
<td>
<form method="POST" style="display:inline;">
    <input type="hidden" name="user_id" value="<?= $u['id'] ?>">
    <button type="submit" name="delete">Delete</button>
</form>
</td>
</tr>
<?php } ?>
</table>
</section>
</body>
</html>
