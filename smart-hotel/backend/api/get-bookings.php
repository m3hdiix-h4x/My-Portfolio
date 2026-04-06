<?php
include "../config/database.php";
include "../controllers/ReservationController.php";

session_start();
$user = $_SESSION['user']['id'] ?? null;
if(!$user) { echo json_encode([]); exit; }

$reservation = new ReservationController($conn);
$reservation->getUserBookings($user);
?>
