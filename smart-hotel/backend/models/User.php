<?php
class User {
    private $conn;
    public function __construct($db){ $this->conn = $db; }

    public function register($name,$email,$password){
        $stmt = $this->conn->prepare("INSERT INTO users (name,email,password) VALUES (?,?,?)");
        $stmt->bind_param("sss",$name,$email,$password);
        return $stmt->execute();
    }

    public function login($email,$password){
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email=? AND password=?");
        $stmt->bind_param("ss",$email,$password);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
