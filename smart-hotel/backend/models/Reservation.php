<?php
class Reservation {
    private $conn;
    public function __construct($db){ $this->conn = $db; }

    public function book($user,$room,$checkin,$checkout){
        $stmt = $this->conn->prepare("INSERT INTO reservations (user,room,checkin,checkout) VALUES (?,?,?,?)");
        $stmt->bind_param("siss",$user,$room,$checkin,$checkout);
        return $stmt->execute();
    }

    public function getUserBookings($user){
        $stmt = $this->conn->prepare("SELECT * FROM reservations WHERE user=?");
        $stmt->bind_param("s",$user);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
