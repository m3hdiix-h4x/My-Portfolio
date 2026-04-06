<?php
include '../backend/config/database.php';
session_start();
if($_SESSION['role'] != 'admin'){ header("Location: login.html"); exit; }

// Update status
if(isset($_POST['update'])){
    $id = $_POST['reservation_id'];
    $status = $_POST['status'];
    $stmt = $conn->prepare("UPDATE reservations SET status=? WHERE id=?");
    $stmt->execute([$status, $id]);
}

// Fetch all reservations
$reservations = $conn->query("
    SELECT r.id, u.name AS user_name, rm.name AS room_name, r.checkin, r.checkout, r.guests, r.status
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN rooms rm ON r.room_id = rm.id
")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Reservations</title>
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<header>
    <div class="logo">Smart<span>Hotel Admin</span></div>
</header>
<section class="dashboard-container">
<h2>Manage Reservations</h2>
<table border="1" style="width:100%; margin-top:20px; text-align:center;">
<tr>
    <th>ID</th>
    <th>User</th>
    <th>Room</th>
    <th>Check-in</th>
    <th>Check-out</th>
    <th>Guests</th>
    <th>Status</th>
    <th>Action</th>
</tr>
<?php foreach($reservations as $r){ ?>
<tr>
<td><?= $r['id'] ?></td>
<td><?= $r['user_name'] ?></td>
<td><?= $r['room_name'] ?></td>
<td><?= $r['checkin'] ?></td>
<td><?= $r['checkout'] ?></td>
<td><?= $r['guests'] ?></td>
<td><?= $r['status'] ?></td>
<td>
    <form method="POST" style="display:inline;">
        <input type="hidden" name="reservation_id" value="<?= $r['id'] ?>">
        <select name="status">
            <option value="Pending" <?= $r['status']=='Pending'?'selected':'' ?>>Pending</option>
            <option value="Confirmed" <?= $r['status']=='Confirmed'?'selected':'' ?>>Confirmed</option>
            <option value="Cancelled" <?= $r['status']=='Cancelled'?'selected':'' ?>>Cancelled</option>
        </select>
        <button type="submit" name="update">Update</button>
    </form>
</td>
</tr>
<?php } ?>
</table>
</section>
</body>
</html>
