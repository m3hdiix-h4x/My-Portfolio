<?php
session_start();

function isAuthenticated() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function requireAuth() {
    if (!isAuthenticated()) {
        header('Location: ../login.html');
        exit();
    }
}

function requireAdmin() {
    if (!isAdmin()) {
        header('Location: ../index.html');
        exit();
    }
}
?>