<?php
/**
 * CSRF token endpoint.
 * Returns a time-based HMAC token valid for up to 2 hours.
 */
declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');

$bucket = (int)(time() / 3600);
$token = hash_hmac('sha256', 'contact:' . $bucket, CSRF_SECRET);

echo json_encode(['token' => $token], JSON_THROW_ON_ERROR);
