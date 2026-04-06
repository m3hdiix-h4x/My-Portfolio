<?php
/**
 * Drop this in C:\xampp\htdocs\smart-hotel\
 * Visit: http://localhost/smart-hotel/find_phpmailer.php
 * It will scan and find where PHPMailer actually is.
 */

echo "<pre style='font-family:monospace;background:#111;color:#fff;padding:20px;'>";
echo "📁 Your smart-hotel folder contains:\n\n";

// List everything in the current folder
$items = scandir(__DIR__);
foreach ($items as $item) {
    if ($item === '.' || $item === '..') continue;
    $type = is_dir(__DIR__ . '/' . $item) ? '📂 FOLDER' : '📄 file  ';
    echo "  $type  →  $item\n";
}

echo "\n\n🔍 Searching for Exception.php anywhere under htdocs...\n\n";

// Recursive search for Exception.php
function findFile($dir, $filename, &$results) {
    if (!is_readable($dir)) return;
    $items = @scandir($dir);
    if (!$items) return;
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            findFile($path, $filename, $results);
        } elseif ($item === $filename) {
            $results[] = $path;
        }
    }
}

$results = [];
findFile('C:/xampp/htdocs', 'Exception.php', $results);

if (empty($results)) {
    echo "  ❌ PHPMailer NOT FOUND anywhere under htdocs!\n";
    echo "  → You need to download it from: https://github.com/PHPMailer/PHPMailer\n";
    echo "  → Click 'Code' → 'Download ZIP'\n";
    echo "  → Extract and rename folder to 'PHPMailer'\n";
    echo "  → Place it at: C:\\xampp\\htdocs\\smart-hotel\\PHPMailer\\\n";
} else {
    echo "  ✅ Found PHPMailer files at:\n";
    foreach ($results as $r) {
        echo "     $r\n";
    }
    echo "\n  👆 Use the path above to fix your require lines!\n";
}

echo "</pre>";