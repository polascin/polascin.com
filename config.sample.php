<?php
/**
 * Site configuration template.
 * Copy this file to config.php and set a strong CSRF_SECRET.
 * Generate one with: php -r "echo bin2hex(random_bytes(32));"
 *
 * config.php is excluded from version control — never commit secrets.
 */
declare(strict_types=1);

define('CSRF_SECRET', getenv('CSRF_SECRET') ?: 'REPLACE_WITH_A_STRONG_RANDOM_SECRET_64_HEX_CHARS');
