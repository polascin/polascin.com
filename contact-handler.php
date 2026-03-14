<?php
/**
 * Contact form handler.
 * Returns JSON responses and performs validation + lightweight rate limiting.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

const ADMIN_EMAIL = 'lubomir@polascin.net';
const SITE_NAME = 'Lubomir Polascin Portfolio';
const RATE_LIMIT_MINUTES = 5;
const RATE_LIMIT_MAX_REQUESTS = 3;

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

function getClientIp(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $parts = explode(',', $forwarded);
        $candidate = trim($parts[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP)) {
            return $candidate;
        }
    }

    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return filter_var($remoteAddr, FILTER_VALIDATE_IP) ? $remoteAddr : 'unknown';
}

function checkRateLimit(string $ip): bool
{
    $logFile = __DIR__ . '/rate-limit.log';
    $now = time();
    $windowStart = $now - (RATE_LIMIT_MINUTES * 60);

    $lines = [];
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    }

    $recentEntries = [];
    $requestCount = 0;

    foreach ($lines as $line) {
        $parts = explode('|', $line);
        if (count($parts) !== 2) {
            continue;
        }

        $entryIp = $parts[0];
        $timestamp = (int) $parts[1];
        if ($timestamp < $windowStart) {
            continue;
        }

        $recentEntries[] = $entryIp . '|' . $timestamp;
        if ($entryIp === $ip) {
            $requestCount++;
        }
    }

    if ($requestCount >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    $recentEntries[] = $ip . '|' . $now;
    file_put_contents($logFile, implode(PHP_EOL, $recentEntries) . PHP_EOL, LOCK_EX);

    return true;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, [
        'success' => false,
        'message' => 'Invalid request method.',
        'errors' => [],
    ]);
}

$clientIp = getClientIp();
if (!checkRateLimit($clientIp)) {
    respond(429, [
        'success' => false,
        'message' => 'Too many requests. Please try again later.',
        'errors' => [],
    ]);
}

$nameInput = filter_input(INPUT_POST, 'name', FILTER_UNSAFE_RAW);
$emailInput = filter_input(INPUT_POST, 'email', FILTER_UNSAFE_RAW);
$messageInput = filter_input(INPUT_POST, 'message', FILTER_UNSAFE_RAW);
$websiteInput = filter_input(INPUT_POST, 'website', FILTER_UNSAFE_RAW);

$name = trim((string) $nameInput);
$email = trim((string) $emailInput);
$message = trim((string) $messageInput);
$website = trim((string) $websiteInput);

if ($website !== '') {
    respond(400, [
        'success' => false,
        'message' => 'Invalid submission.',
        'errors' => [
            'security' => 'Spam protection triggered.',
        ],
    ]);
}

$errors = [];

if ($name === '' || textLength($name) < 2 || textLength($name) > 100) {
    $errors['name'] = 'Please provide a valid name (2-100 characters).';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    $errors['email'] = 'Please provide a valid email address.';
}

if ($message === '' || textLength($message) < 10 || textLength($message) > 2000) {
    $errors['message'] = 'Message must be between 10 and 2000 characters.';
}

$suspiciousPatterns = [
    '/<script/i',
    '/javascript:/i',
    '/on\w+\s*=/i',
    '/<iframe/i',
    '/<object/i',
    '/<embed/i',
];

foreach ([$name, $email, $message] as $fieldValue) {
    foreach ($suspiciousPatterns as $pattern) {
        if (preg_match($pattern, $fieldValue) === 1) {
            $errors['security'] = 'Invalid input detected.';
            break 2;
        }
    }
}

if ($errors !== []) {
    respond(400, [
        'success' => false,
        'message' => 'Please correct the errors below.',
        'errors' => $errors,
    ]);
}

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
$serverName = htmlspecialchars($_SERVER['SERVER_NAME'] ?? 'localhost', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$dateString = date('Y-m-d H:i:s T');

$headerSafeName = preg_replace('/[\r\n]+/', ' ', $name);
$headerSafeEmail = preg_replace('/[\r\n]+/', '', $email);

$subject = 'New Contact Form Submission from ' . SITE_NAME;

$emailBody = "<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; }
    .container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    .header { background: #3b82f6; color: #ffffff; padding: 16px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 14px; }
    .label { font-weight: bold; display: block; margin-bottom: 4px; }
    .value { background: #f1f5f9; padding: 10px; border-radius: 4px; }
    .footer { font-size: 12px; color: #64748b; margin-top: 16px; }
  </style>
</head>
<body>
  <div class=\"container\">
    <div class=\"header\">
      <h2>New Contact Form Submission</h2>
      <p>From your portfolio website</p>
    </div>
    <div class=\"content\">
      <div class=\"field\">
        <span class=\"label\">From:</span>
        <div class=\"value\">{$safeName}</div>
      </div>
      <div class=\"field\">
        <span class=\"label\">Email:</span>
        <div class=\"value\">{$safeEmail}</div>
      </div>
      <div class=\"field\">
        <span class=\"label\">Message:</span>
        <div class=\"value\">{$safeMessage}</div>
      </div>
      <div class=\"footer\">
        <p>Sent from {$serverName} at {$dateString}</p>
        <p>IP: {$clientIp}</p>
      </div>
    </div>
  </div>
</body>
</html>";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . SITE_NAME . ' <noreply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>',
    'Reply-To: ' . $headerSafeName . ' <' . $headerSafeEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Originating-IP: ' . $clientIp,
];

$mailSent = @mail(ADMIN_EMAIL, $subject, $emailBody, implode("\r\n", $headers));
$logFile = __DIR__ . '/contact-log.txt';

if ($mailSent) {
    $logLine = sprintf(
        "[%s] SUCCESS: Contact from %s (%s) - IP: %s\n",
        $dateString,
        $name,
        $email,
        $clientIp
    );
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

    respond(200, [
        'success' => true,
        'message' => 'Thank you for your message. I will get back to you soon.',
        'errors' => [],
    ]);
}

$logLine = sprintf(
    "[%s] FAILED: Mail send failed for %s (%s) - IP: %s\n",
    $dateString,
    $name,
    $email,
    $clientIp
);
file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);

respond(500, [
    'success' => false,
    'message' => 'Sorry, there was an error sending your message. Please try again later.',
    'errors' => [],
]);
