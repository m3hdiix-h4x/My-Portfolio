<?php
include_once "../config/database.php";
include_once "../models/Room.php";

class RoomController {
    private $roomModel;

    public function __construct($conn){
        $this->roomModel = new Room($conn);
    }

    public function getAll(){
        echo json_encode($this->roomModel->getAll());
    }

    public function get($id){
        echo json_encode($this->roomModel->get($id));
    }
}
?>
