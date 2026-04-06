<?php
/**
 * Get Rooms API Endpoint
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../config/database.php';

try {
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();

    // Build query
    $query = "SELECT id, name, type, description, price_per_night, capacity, amenities, images, status 
              FROM rooms 
              WHERE 1=1";

    // Add filters if provided
    if (isset($_GET['type']) && $_GET['type'] != 'all') {
        $query .= " AND type = :type";
    }

    if (isset($_GET['min_price'])) {
        $query .= " AND price_per_night >= :min_price";
    }

    if (isset($_GET['max_price'])) {
        $query .= " AND price_per_night <= :max_price";
    }

    if (isset($_GET['capacity'])) {
        $query .= " AND capacity >= :capacity";
    }

    if (isset($_GET['status'])) {
        $query .= " AND status = :status";
    } else {
        $query .= " AND status = 'available'";
    }

    $query .= " ORDER BY price_per_night ASC";

    $stmt = $db->prepare($query);

    // Bind parameters if they exist
    if (isset($_GET['type']) && $_GET['type'] != 'all') {
        $stmt->bindParam(":type", $_GET['type']);
    }

    if (isset($_GET['min_price'])) {
        $stmt->bindParam(":min_price", $_GET['min_price']);
    }

    if (isset($_GET['max_price'])) {
        $stmt->bindParam(":max_price", $_GET['max_price']);
    }

    if (isset($_GET['capacity'])) {
        $stmt->bindParam(":capacity", $_GET['capacity']);
    }

    if (isset($_GET['status'])) {
        $stmt->bindParam(":status", $_GET['status']);
    }

    $stmt->execute();

    $rooms = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $room = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "type" => $row['type'],
            "description" => $row['description'],
            "price" => floatval($row['price_per_night']),
            "capacity" => intval($row['capacity']),
            "amenities" => json_decode($row['amenities']),
            "images" => json_decode($row['images']),
            "status" => $row['status']
        );
        
        array_push($rooms, $room);
    }

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "count" => count($rooms),
        "rooms" => $rooms
    ));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage()
    ));
}
?>