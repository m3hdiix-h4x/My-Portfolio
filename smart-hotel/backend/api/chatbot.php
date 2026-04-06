<?php
/**
 * Chatbot API Endpoint
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
if (empty($data->message)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "message" => "Message is required."
    ));
    exit();
}

try {
    $user_message = strtolower($data->message);
    $response = getBotResponse($user_message);
    $intent = detectIntent($user_message);

    // Save to database
    if (!empty($data->session_id)) {
        $database = new Database();
        $db = $database->getConnection();

        $query = "INSERT INTO chatbot_messages (session_id, message, response, intent) 
                  VALUES (:session_id, :message, :response, :intent)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(":session_id", $data->session_id);
        $stmt->bindParam(":message", $data->message);
        $stmt->bindParam(":response", $response);
        $stmt->bindParam(":intent", $intent);
        $stmt->execute();
    }

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "response" => $response,
        "intent" => $intent
    ));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "An error occurred: " . $e->getMessage()
    ));
}

function detectIntent($message) {
    $intents = array(
        'booking' => ['book', 'reserve', 'availability', 'available'],
        'services' => ['service', 'amenities', 'facilities', 'spa', 'pool'],
        'pricing' => ['price', 'cost', 'rate', 'how much'],
        'location' => ['where', 'location', 'address', 'directions'],
        'checkin' => ['check-in', 'check in', 'checkin', 'arrival'],
        'checkout' => ['check-out', 'check out', 'checkout', 'departure'],
        'parking' => ['park', 'parking', 'valet'],
        'wifi' => ['wifi', 'wi-fi', 'internet'],
        'pets' => ['pet', 'dog', 'cat', 'animal'],
        'breakfast' => ['breakfast', 'food', 'meal']
    );

    foreach ($intents as $intent => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                return $intent;
            }
        }
    }

    return 'general';
}

function getBotResponse($message) {
    $responses = array(
        'greetings' => array(
            'Hello! How can I assist you today?',
            'Hi there! Welcome to SmartHotel. What can I help you with?',
            'Greetings! I\'m here to help with your hotel needs.'
        )
    );

    // Greetings
    if (preg_match('/^(hi|hello|hey|greetings)/', $message)) {
        return $responses['greetings'][array_rand($responses['greetings'])];
    }

    // Availability/Booking
    if (strpos($message, 'availab') !== false || strpos($message, 'book') !== false || strpos($message, 'reserve') !== false) {
        return "I'd be happy to help you check room availability! We have several room types available:<br><br>• Standard Room - $129/night<br>• Executive Room - $199/night<br>• Deluxe Suite - $299/night<br>• Presidential Suite - $499/night<br><br>What dates are you interested in?";
    }

    // Services
    if (strpos($message, 'service') !== false || strpos($message, 'ameniti') !== false || strpos($message, 'facilit') !== false) {
        return "SmartHotel offers a wide range of premium services:<br><br>🍽️ Fine Dining & 24/7 Room Service<br>💆 Luxury Spa & Wellness Center<br>🏊 Infinity Pool & Fitness Center<br>🚗 Airport Transfer & Valet Parking<br>💼 Business Center & Meeting Rooms<br><br>Would you like more details about any specific service?";
    }

    // Pricing
    if (strpos($message, 'price') !== false || strpos($message, 'cost') !== false || strpos($message, 'rate') !== false) {
        return "Our room rates are:<br><br>Standard Room: $129/night<br>Executive Room: $199/night<br>Deluxe Suite: $299/night<br>Presidential Suite: $499/night<br><br>All rates include free WiFi, breakfast, and pool access!";
    }

    // Check-in/Check-out
    if (strpos($message, 'check') !== false) {
        return "Check-in and check-out information:<br><br>⏰ Check-in: 3:00 PM<br>⏰ Check-out: 11:00 AM<br><br>Early check-in and late check-out available upon request!";
    }

    // Parking
    if (strpos($message, 'park') !== false) {
        return "Parking options:<br><br>🚗 Valet Parking: $20/day<br>🅿️ Self-Parking: $15/day<br>🔌 EV Charging: Available<br><br>All parking areas are secure and monitored 24/7.";
    }

    // WiFi
    if (strpos($message, 'wifi') !== false || strpos($message, 'internet') !== false) {
        return "WiFi Information:<br><br>✓ Free high-speed WiFi throughout the hotel<br>✓ No password required<br>✓ Premium bandwidth available<br><br>Simply connect to 'SmartHotel-WiFi' network!";
    }

    // Default response
    return "Thank you for your message! I'm here to assist with bookings, hotel information, and local recommendations. You can ask me about room availability, services, pricing, check-in times, and more. How can I help you?";
}
?>