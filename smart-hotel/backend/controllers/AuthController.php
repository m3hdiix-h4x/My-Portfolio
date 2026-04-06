<?php
include_once "../config/database.php";
include_once "../models/User.php";

class AuthController {
    private $userModel;

    public function __construct($conn){
        $this->userModel = new User($conn);
    }

    public function login($email, $password){
        $user = $this->userModel->login($email,$password);
        if($user){
            $_SESSION['user'] = $user;
            echo "success";
        } else {
            echo "invalid";
        }
    }

    public function register($name, $email, $password){
        $success = $this->userModel->register($name,$email,$password);
        echo $success ? "success" : "error";
    }
}
?>
