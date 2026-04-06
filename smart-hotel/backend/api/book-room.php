<?php
/**
 * Book Room API Endpoint
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->roomType) || empty($data->checkin) || empty($data->checkout)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Room type, check-in and check-out dates are required."
    ));
    exit();
}

try {
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();

    // Find available room of requested type
    $room_query = "SELECT id, price_per_night 
                   FROM rooms 
                   WHERE type = :type 
                   AND status = 'available'
                   AND id NOT IN (
                       SELECT room_id FROM reservations 
                       WHERE status NOT IN ('cancelled', 'checked-out')
                       AND (
                           (check_in_date <= :checkout AND check_out_date >= :checkin)
                       )
                   )
                   LIMIT 1";
    
    $room_stmt = $db->prepare($room_query);
    $room_stmt->bindParam(":type", $data->roomType);
    $room_stmt->bindParam(":checkin", $data->checkin);
    $room_stmt->bindParam(":checkout", $data->checkout);
    $room_stmt->execute();

    if ($room_stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "No rooms available for selected dates."
        ));
        exit();
    }

    $room = $room_stmt->fetch(PDO::FETCH_ASSOC);

    // Calculate total amount
    $checkin_date = new DateTime($data->checkin);
    $checkout_date = new DateTime($data->checkout);
    $nights = $checkin_date->diff($checkout_date)->days;
    $room_total = $room['price_per_night'] * $nights;
    
    // Add services cost
    $services_total = 0;
    if (!empty($data->services)) {
        foreach ($data->services as $service) {
            switch ($service) {
                case 'airport':
                    $services_total += 50;
                    break;
                case 'breakfast':
                    $services_total += 25 * $nights;
                    break;
                case 'spa':
                    $services_total += 100;
                    break;
                case 'parking':
                    $services_total += 20 * $nights;
                    break;
            }
        }
    }
    
    $subtotal = $room_total + $services_total;
    $tax = $subtotal * 0.10;
    $total_amount = $subtotal + $tax;

    // Generate booking ID
    $booking_id = 'BK' . time();

    // Insert reservation
    $insert_query = "INSERT INTO reservations 
                     (booking_id, user_id, room_id, check_in_date, check_out_date, 
                      num_guests, special_requests, services, total_amount, status, payment_status) 
                     VALUES 
                     (:booking_id, :user_id, :room_id, :check_in_date, :check_out_date, 
                      :num_guests, :special_requests, :services, :total_amount, 'confirmed', 'paid')";
    
    $insert_stmt = $db->prepare($insert_query);

    // For demo, use guest user (user_id = 1) or extract from session/token
    $user_id = 1;
    $services_json = json_encode($data->services ?? []);

    $insert_stmt->bindParam(":booking_id", $booking_id);
    $insert_stmt->bindParam(":user_id", $user_id);
    $insert_stmt->bindParam(":room_id", $room['id']);
    $insert_stmt->bindParam(":check_in_date", $data->checkin);
    $insert_stmt->bindParam(":check_out_date", $data->checkout);
    $insert_stmt->bindParam(":num_guests", $data->guests);
    $insert_stmt->bindParam(":special_requests", $data->specialRequests);
    $insert_stmt->bindParam(":services", $services_json);
    $insert_stmt->bindParam(":total_amount", $total_amount);

    if ($insert_stmt->execute()) {
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Booking confirmed successfully.",
            "booking_id" => $booking_id,
            "reservation_id" => $db->lastInsertId(),
            "total_amount" => $total_amount
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to create booking."
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage()
    ));
}
?>