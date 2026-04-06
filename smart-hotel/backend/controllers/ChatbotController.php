<?php
class ChatbotController {
    public function reply($message){
        // Simple example logic
        $message = strtolower($message);
        if(strpos($message,"hello")!==false){
            return "Hello! How can I help you?";
        } elseif(strpos($message,"room")!==false){
            return "You can book rooms on the Booking page.";
        } else {
            return "I am here to assist you with hotel info.";
        }
    }
}
?>
