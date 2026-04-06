<?php
/**
 * SmartHotel - Email Test Script
 * Visit: http://localhost/smart-hotel/test_mail.php
 * Delete this file after testing!
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'C:/xampp/htdocs/smart-hotel/PHPMailer/src/Exception.php';
require 'C:/xampp/htdocs/smart-hotel/PHPMailer/src/PHPMailer.php';
require 'C:/xampp/htdocs/smart-hotel/PHPMailer/src/SMTP.php';
?>
<!DOCTYPE html>
<html>
<head>
    <title>SmartHotel - Mail Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; background: #111; color: #fff; }
        h2   { color: #c9b896; }
        .box { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 20px; margin: 20px 0; }
        .ok  { color: #2ecc71; font-weight: bold; }
        .err { color: #e74c3c; font-weight: bold; }
        .log { background: #000; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 0.85em; white-space: pre-wrap; color: #aaa; max-height: 300px; overflow-y: auto; margin-top: 10px; }
        input, button { padding: 10px 15px; border-radius: 6px; border: 1px solid #555; background: #222; color: #fff; font-size: 1em; }
        button { background: #c9b896; color: #000; font-weight: bold; cursor: pointer; border: none; margin-top: 10px; }
        label  { display: block; margin-bottom: 6px; color: #aaa; font-size: 0.9em; }
    </style>
</head>
<body>
<h2>🔧 SmartHotel — Email Test</h2>

<?php
// ── CONFIG (must match send_confirmation.php) ──
$SMTP_USER = 'komitari00@gmail.com';
$SMTP_PASS = 'lcsc nikc xtpp fklx';

// ── Send to address comes from the form below ──
$sendTo = $_POST['send_to'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $sendTo) {

    $debugLog = '';
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug   = SMTP::DEBUG_SERVER;
        $mail->Debugoutput = function($str) use (&$debugLog) {
            $debugLog .= htmlspecialchars(trim($str)) . "\n";
        };

        $mail->isSMTP();
        $mail->Host        = 'smtp.gmail.com';
        $mail->SMTPAuth    = true;
        $mail->Username    = $SMTP_USER;
        $mail->Password    = $SMTP_PASS;
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

        $mail->setFrom($SMTP_USER, 'SmartHotel');
        $mail->addAddress($sendTo);
        $mail->isHTML(true);
        $mail->Subject = 'SmartHotel - Test Email ✅';
        $mail->Body    = '<h2 style="color:#c9b896">SmartHotel</h2><p>This is a test email. If you received this, your email setup is working perfectly!</p>';
        $mail->AltBody = 'SmartHotel test email - setup is working!';

        $mail->send();

        echo "<div class='box'><span class='ok'>✅ SUCCESS! Email sent to " . htmlspecialchars($sendTo) . "</span><br><br>Check your inbox (and spam folder).<div class='log'>$debugLog</div></div>";

    } catch (Exception $e) {
        $errMsg = $mail->ErrorInfo;

        // ── Friendly diagnosis ──
        $diagnosis = '';
        if (str_contains($errMsg, 'Username and Password not accepted') || str_contains($errMsg, 'AUTHENTICATIONFAILED')) {
            $diagnosis = "❌ <b>Wrong App Password.</b> Make sure you generated an App Password (not your Gmail login). Go to: <a href='https://myaccount.google.com/apppasswords' target='_blank' style='color:#c9b896'>myaccount.google.com/apppasswords</a>";
        } elseif (str_contains($errMsg, 'Connection refused') || str_contains($errMsg, 'Connection timed out')) {
            $diagnosis = "❌ <b>XAMPP is blocking port 587.</b> Your firewall or antivirus is blocking the connection. Try disabling your antivirus temporarily, or use port 465.";
        } elseif (str_contains($errMsg, 'certificate') || str_contains($errMsg, 'SSL')) {
            $diagnosis = "❌ <b>SSL certificate error.</b> The SMTPOptions fix should handle this — make sure it's in the code.";
        } elseif (str_contains($errMsg, '2-Step')) {
            $diagnosis = "❌ <b>2-Step Verification is not enabled.</b> Enable it first at myaccount.google.com/security, then generate an App Password.";
        } else {
            $diagnosis = "❌ <b>Unknown error.</b> See the full log below.";
        }

        echo "<div class='box'>
            <span class='err'>❌ FAILED</span><br><br>
            <b>Error:</b> " . htmlspecialchars($errMsg) . "<br><br>
            <b>Diagnosis:</b> $diagnosis
            <div class='log'>$debugLog</div>
        </div>";
    }
}
?>

<div class="box">
    <form method="POST">
        <label>Send test email to:</label>
        <input type="email" name="send_to" value="<?= htmlspecialchars($sendTo) ?>"
               placeholder="your@email.com" required style="width:300px">
        <br>
        <button type="submit">🚀 Send Test Email</button>
    </form>
</div>

<div class="box" style="font-size:0.85em; color:#666;">
    <b style="color:#aaa">Current config:</b><br>
    SMTP User: <?= htmlspecialchars($SMTP_USER) ?><br>
    SMTP Host: smtp.gmail.com : 587 (STARTTLS)<br>
    <br>
    <b style="color:#e74c3c">⚠️ Delete this file after testing — it shows your credentials!</b>
</div>

</body>
</html>