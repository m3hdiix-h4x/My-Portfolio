<?php
include_once "../config/database.php";
include_once "../models/Reservation.php";

class ReservationController {
    private $reservation;

    public function __construct($conn){
        $this->reservation = new Reservation($conn);
    }

    public function book($user,$room,$checkin,$checkout){
        $success = $this->reservation->book($user,$room,$checkin,$checkout);
        echo $success ? "Booking successful" : "Booking failed";
    }

    public function getUserBookings($user){
        echo json_encode($this->reservation->getUserBookings($user));
    }
}
?>
