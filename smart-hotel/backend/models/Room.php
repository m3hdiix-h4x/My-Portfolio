<?php
class Room {
    private $conn;
    public function __construct($db){ $this->conn = $db; }

    public function getAll(){
        $res = $this->conn->query("SELECT * FROM rooms");
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    public function get($id){
        $stmt = $this->conn->prepare("SELECT * FROM rooms WHERE id=?");
        $stmt->bind_param("i",$id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
