<?php
/**
 * Enhanced Contact Form Handler
 * Processes form submissions with security, rate limiting, and validation
 */

header("Content-Type: application/json");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");

// Configuration
define("ADMIN_EMAIL", "lubomir.polascin@example.com"); // Update with your email
define("SITE_NAME", "Lubomir Polascin Portfolio");
define("RATE_LIMIT_MINUTES", 5);
define("RATE_LIMIT_MAX_REQUESTS", 3);

// Initialize response
$response = [
    "success" => false,
    "message" => "",
    "errors" => []
];

// Rate limiting
function checkRateLimit($ip) {
    $logFile = __DIR__ . "/rate-limit.log";
    $currentTime = time();
    $windowStart = $currentTime - (RATE_LIMIT_MINUTES * 60);
    
    // Read existing log
    $requests = [];
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $parts = explode("|", $line);
            if (count($parts) === 2 && $parts[0] === $ip) {
                $timestamp = (int)$parts[1];
                if ($timestamp > $windowStart) {
                    $requests[] = $timestamp;
                }
            }
        }
    }
    
    // Check if rate limit exceeded
    if (count($requests) >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    
    // Log this request
    file_put_contents($logFile, $ip . "|" . $currentTime . "
", FILE_APPEND);
    return true;
}

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $response["message"] = "Invalid request method.";
    echo json_encode($response);
    exit;
}

// Rate limiting check
$clientIP = $_SERVER["HTTP_X_FORWARDED_FOR"] ?? $_SERVER["REMOTE_ADDR"] ?? "unknown";
if (!checkRateLimit($clientIP)) {
    $response["message"] = "Too many requests. Please try again later.";
    http_response_code(429);
    echo json_encode($response);
    exit;
}

// Sanitize and validate input
$name = trim(filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING));
$email = trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL));
$message = trim(filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING));

// Validation
$errors = [];
if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors["name"] = "Please provide a valid name (2-100 characters).";
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    $errors["email"] = "Please provide a valid email address.";
}
if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors["message"] = "Message must be between 10 and 2000 characters.";
}

// Check for suspicious content
$suspiciousPatterns = [
    "/<script/i",
    "/javascript:/i",
    "/on\w+\s*=/i",
    "/<iframe/i",
    "/<object/i",
    "/<embed/i"
];
foreach ([$name, $email, $message] as $field) {
    foreach ($suspiciousPatterns as $pattern) {
        if (preg_match($pattern, $field)) {
            $errors["security"] = "Invalid input detected.";
            break 2;
        }
    }
}

// If validation fails
if (!empty($errors)) {
    $response["errors"] = $errors;
    $response["message"] = "Please correct the errors below.";
    http_response_code(400);
    echo json_encode($response);
    exit;
}

// Prepare email
$to = ADMIN_EMAIL;
$subject = "New Contact Form Submission from " . SITE_NAME;

// Sanitize for email
$safeName = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
$safeEmail = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
$safeMessage = htmlspecialchars($message, ENT_QUOTES, "UTF-8");

// Email body (HTML)
$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <style>
        body { font-family: \"Inter\", Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; }
        .container { background: #f8fafc; padding: 20px; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .field { margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .label { font-weight: bold; color: #475569; display: block; margin-bottom: 5px; }
        .value { background: #f1f5f9; padding: 10px; border-radius: 4px; word-wrap: break-word; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class=\"container\">
        <div class=\"header\">
            <h2>📬 New Contact Form Submission</h2>
            <p>From your portfolio website</p>
        </div>
        <div class=\"content\">
            <div class=\"field\">
                <span class=\"label\">👤 From:</span>
                <div class=\"value\">{$safeName}</div>
            </div>
            <div class=\"field\">
                <span class=\"label\">📧 Email:</span>
                <div class=\"value\">{$safeEmail}</div>
            </div>
            <div class=\"field\">
                <span class=\"label\">💬 Message:</span>
                <div class=\"value\">" . nl2br($safeMessage) . "</div>
            </div>
            <div class=\"footer\">
                <p>Sent from {$_SERVER["SERVER_NAME"]} on " . date("l, F j, Y \\a\\t g:i A T") . "</p>
                <p>IP: {$clientIP}</p>
            </div>
        </div>
    </div>
</body>
</html>
";
        .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .field { margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .label { font-weight: bold; color: #475569; display: block; margin-bottom: 5px; }
        .value { background: #f1f5f9; padding: 10px; border-radius: 4px; word-wrap: break-word; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📬 New Contact Form Submission</h2>
            <p>From your portfolio website</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 From:</span>
                <div class="value">{$safeName}</div>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value">{$safeEmail}</div>
            </div>
            <div class="field">
                <span class="label">💬 Message:</span>
                <div class="value">" . nl2br($safeMessage) . "</div>
            </div>
            <div class="footer">
                <p>Sent from {$_SERVER["SERVER_NAME"]} on " . date("l, F j, Y \a\t g:i A T") . "</p>
                <p>IP: {$clientIP}</p>
            </div>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    "MIME-Version: 1.0",
    "Content-type: text/html; charset=UTF-8",
    "From: " . SITE_NAME . " <noreply@" . $_SERVER["SERVER_NAME"] . ">",
    "Reply-To: " . $safeName . " <" . $email . ">",
    "X-Mailer: PHP/" . phpversion(),
    "X-Originating-IP: " . $clientIP
];

// Send email with error handling
try {
    $mailSent = mail($to, $subject, $emailBody, implode("
", $headers));
    
    if ($mailSent) {
        // Log successful submission
        $logEntry = sprintf(
            "[] SUCCESS: Contact from  () - IP: 
",
            date("Y-m-d H:i:s"),
            $safeName,
            $safeEmail,
            $clientIP
        );
        file_put_contents(__DIR__ . "/contact-log.txt", $logEntry, FILE_APPEND);
        
        $response["success"] = true;
        $response["message"] = "Thank you for your message! I will get back to you within 24 hours.";
    } else {
        // Log failed submission
        $logEntry = sprintf(
            "[] FAILED: Mail function returned false - From:  () - IP: 
",
            date("Y-m-d H:i:s"),
            $safeName,
            $safeEmail,
            $clientIP
        );
        file_put_contents(__DIR__ . "/contact-log.txt", $logEntry, FILE_APPEND);
        
        $response["message"] = "Sorry, there was an error sending your message. Please try again later or contact me directly.";
        http_response_code(500);
    }
} catch (Exception $e) {
    // Log exception
    $logEntry = sprintf(
        "[] EXCEPTION:  - From:  () - IP: 
",
        date("Y-m-d H:i:s"),
        $e->getMessage(),
        $safeName,
        $safeEmail,
        $clientIP
    );
    file_put_contents(__DIR__ . "/contact-log.txt", $logEntry, FILE_APPEND);
    
    $response["message"] = "An unexpected error occurred. Please try again later.";
    http_response_code(500);
}

echo json_encode($response);
exit;
