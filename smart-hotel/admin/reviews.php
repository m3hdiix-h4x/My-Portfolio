<?php
include '../backend/config/database.php';
session_start();
if($_SESSION['role'] != 'admin'){ header("Location: login.html"); exit; }

// Delete review
if(isset($_POST['delete'])){
    $id = $_POST['review_id'];
    $conn->prepare("DELETE FROM reviews WHERE id=?")->execute([$id]);
}

// Fetch all reviews
$reviews = $conn->query("
    SELECT rv.id, u.name AS user_name, rm.name AS room_name, rv.rating, rv.comment, rv.created_at
    FROM reviews rv
    JOIN users u ON rv.user_id = u.id
    JOIN rooms rm ON rv.room_id = rm.id
")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Reviews</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<header>
    <div class="logo">Smart<span>Hotel Admin</span></div>
</header>
<section class="dashboard-container">
<h2>Manage Reviews</h2>
<table border="1" style="width:100%; margin-top:20px; text-align:center;">
<tr>
    <th>ID</th>
    <th>User</th>
    <th>Room</th>
    <th>Rating</th>
    <th>Comment</th>
    <th>Action</th>
</tr>
<?php foreach($reviews as $r){ ?>
<tr>
<td><?= $r['id'] ?></td>
<td><?= $r['user_name'] ?></td>
<td><?= $r['room_name'] ?></td>
<td><?= $r['rating'] ?>⭐</td>
<td><?= $r['comment'] ?></td>
<td>
<form method="POST" style="display:inline;">
    <input type="hidden" name="review_id" value="<?= $r['id'] ?>">
    <button type="submit" name="delete">Delete</button>
</form>
</td>
</tr>
<?php } ?>
</table>
</section>
</body>
</html>
