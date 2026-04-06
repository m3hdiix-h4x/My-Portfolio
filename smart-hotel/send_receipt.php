<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ── Path to PHPMailer (adjust if your folder structure differs) ──────────────
$base = 'C:/xampp/htdocs/smart-hotel/PHPMailer/src/';
require $base . 'Exception.php';
require $base . 'PHPMailer.php';
require $base . 'SMTP.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// ── Accept JSON body (sent via fetch) OR classic $_POST form submit ──────────
$data = json_decode(file_get_contents("php://input"), true);

// Fallback to $_POST if the request came from a regular HTML form
if (empty($data) && !empty($_POST)) {
    $data = $_POST;
}

// ── Validate ─────────────────────────────────────────────────────────────────
if (empty($data)) {
    echo json_encode(["success" => false, "message" => "No data received."]);
    exit;
}

$guestEmail = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);

if (!filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid or missing guest email: '$guestEmail'"]);
    exit;
}

// ── Sanitise all fields ───────────────────────────────────────────────────────
$guestName  = htmlspecialchars($data['name']     ?? 'Valued Guest');
$room       = htmlspecialchars($data['room']     ?? 'N/A');
$checkIn    = htmlspecialchars($data['checkin']  ?? 'N/A');
$checkOut   = htmlspecialchars($data['checkout'] ?? 'N/A');
$price      = htmlspecialchars($data['price']    ?? 'N/A');
$nights     = htmlspecialchars($data['nights']   ?? '');
$guests     = htmlspecialchars($data['guests']   ?? '');
$confNumber = htmlspecialchars($data['confirmationNumber'] ?? ('SH-' . strtoupper(substr(md5(uniqid()), 0, 9))));

// ── Send ──────────────────────────────────────────────────────────────────────
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host        = 'smtp.gmail.com';
    $mail->SMTPAuth    = true;
    $mail->Username    = 'komitari00@gmail.com';   // your Gmail
    $mail->Password    = 'lcsc nikc xtpp fklx';    // app password
    $mail->SMTPSecure  = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port        = 587;
    $mail->Timeout     = 30;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ];

    $mail->setFrom('komitari00@gmail.com', 'SmartHotel');
    $mail->addAddress($guestEmail, $guestName);   // ← guest's own email

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = "✦ SmartHotel — Payment Receipt ({$confNumber})";

    // ── Styled HTML email ─────────────────────────────────────────────────────
    $mail->Body = "
<!DOCTYPE html>
<html lang='en'>
<head><meta charset='UTF-8'></head>
<body style='margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;'>

  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f4;padding:40px 20px;'>
    <tr><td>
      <table width='600' align='center' cellpadding='0' cellspacing='0'
             style='background:#080808;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;'>

        <!-- Header -->
        <tr>
          <td style='background:linear-gradient(135deg,#a89674,#f4e4c1);padding:40px 48px;text-align:center;'>
            <p style='margin:0;font-family:Georgia,serif;font-size:32px;font-weight:700;letter-spacing:0.2em;color:#080808;text-transform:uppercase;'>
              SmartHotel
            </p>
            <p style='margin:10px 0 0;font-size:13px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(0,0,0,0.6);font-family:Arial,sans-serif;'>
              Luxury Hospitality
            </p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style='padding:44px 48px 28px;text-align:center;'>
            <div style='display:inline-block;background:#1a3a5e;border:1px solid #3b82f6;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;color:#3b82f6;'>
              &#9646;
            </div>
            <h1 style='margin:20px 0 6px;font-family:Georgia,serif;font-size:34px;font-weight:400;color:#ffffff;'>
              Payment <em style='font-style:italic;color:#c9b896;'>Receipt</em>
            </h1>
            <p style='margin:0;font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.55);letter-spacing:0.1em;'>
              Dear <strong style='color:#c9b896;'>{$guestName}</strong>, thank you for your payment.
            </p>
          </td>
        </tr>

        <!-- Confirmation number -->
        <tr>
          <td style='padding:0 48px 28px;text-align:center;'>
            <div style='display:inline-block;padding:14px 28px;border:1px solid rgba(201,184,150,0.3);border-radius:50px;background:rgba(201,184,150,0.07);'>
              <span style='font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.5);'>Confirmation No.</span>
              &nbsp;&nbsp;
              <span style='font-family:Georgia,serif;font-size:20px;font-weight:700;color:#c9b896;letter-spacing:0.1em;'>
                {$confNumber}
              </span>
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style='padding:0 48px;'>
          <div style='height:1px;background:linear-gradient(90deg,transparent,rgba(201,184,150,0.25),transparent);'></div>
        </td></tr>

        <!-- Booking details -->
        <tr>
          <td style='padding:36px 48px 20px;'>
            <p style='margin:0 0 20px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#c9b896;'>
              Booking Summary
            </p>
            <table width='100%' cellpadding='0' cellspacing='0'>
              <tr>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.05);'>Guest</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;'>{$guestName}</td>
              </tr>
              <tr style='background:rgba(255,255,255,0.02);'>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.05);'>Room</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;'>{$room}</td>
              </tr>
              <tr>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.05);'>Check-in</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;'>{$checkIn}</td>
              </tr>
              <tr style='background:rgba(255,255,255,0.02);'>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.05);'>Check-out</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;'>{$checkOut}</td>
              </tr>
              " . ($nights ? "
              <tr>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);border-bottom:1px solid rgba(255,255,255,0.05);'>Nights</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;'>{$nights}</td>
              </tr>" : "") . "
              " . ($guests ? "
              <tr style='background:rgba(255,255,255,0.02);'>
                <td style='padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.5);'>Guests</td>
                <td style='padding:10px 14px;font-family:Georgia,serif;font-size:14px;color:#fff;text-align:right;'>{$guests}</td>
              </tr>" : "") . "
            </table>
          </td>
        </tr>

        <!-- Total paid -->
        <tr>
          <td style='padding:0 48px 36px;'>
            <table width='100%' cellpadding='0' cellspacing='0'
                   style='background:rgba(201,184,150,0.08);border:1px solid rgba(201,184,150,0.25);border-radius:12px;'>
              <tr>
                <td style='padding:20px 22px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#c9b896;'>
                  Total Paid
                </td>
                <td style='padding:20px 22px;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#c9b896;text-align:right;'>
                  {$price} MAD
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Good to know -->
        <tr>
          <td style='padding:0 48px 36px;'>
            <div style='background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 22px;'>
              <p style='margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#c9b896;'>Good to Know</p>
              <p style='margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.55);'>• Check-in from 3:00 PM &nbsp;·&nbsp; Check-out by 12:00 noon</p>
              <p style='margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.55);'>• Free cancellation up to 48 hours before arrival</p>
              <p style='margin:0;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.55);'>• 24/7 concierge: <a href='tel:+212708732437' style='color:#c9b896;'>+212 708-732437</a></p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style='background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);padding:28px 48px;text-align:center;'>
            <p style='margin:0 0 6px;font-family:Georgia,serif;font-size:16px;color:rgba(255,255,255,0.7);font-style:italic;'>
              We look forward to welcoming you.
            </p>
            <p style='margin:0;font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.3);letter-spacing:0.08em;'>
              123 Luxury Avenue &nbsp;·&nbsp; reservations@smarthotel.com &nbsp;·&nbsp; +212 708-732437
            </p>
            <p style='margin:16px 0 0;font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.2);'>
              &copy; 2026 SmartHotel. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
    ";

    // ── Plain-text fallback ───────────────────────────────────────────────────
    $mail->AltBody =
        "SmartHotel — Payment Receipt\n\n"
      . "Dear {$guestName},\n\n"
      . "Confirmation No.: {$confNumber}\n"
      . "Room:             {$room}\n"
      . "Check-in:         {$checkIn}\n"
      . "Check-out:        {$checkOut}\n"
      . ($nights ? "Nights:           {$nights}\n" : "")
      . ($guests ? "Guests:           {$guests}\n" : "")
      . "Total Paid:       {$price} MAD\n\n"
      . "Thank you for choosing SmartHotel.\n"
      . "24/7 concierge: +212 708-732437";

    $mail->send();

    echo json_encode(["success" => true, "sentTo" => $guestEmail]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $mail->ErrorInfo
    ]);
}