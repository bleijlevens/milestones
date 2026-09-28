<?php

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
    exit;
}

// Read JSON sent by the browser
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$subjID = $data['subjID'] ?? null;

if (!$subjID) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing participant ID'
    ]);
    exit;
}

// Make participant ID safe for filename
$safeID = preg_replace('/[^A-Za-z0-9_-]/', '_', $subjID);

// Participant CSV file
$file = __DIR__ . '/milestones-' . $safeID . '.csv';

// If no file exists, treat that as already deleted
if (!file_exists($file)) {
    echo json_encode([
        'success' => true,
        'deleted' => false
    ]);
    exit;
}

// Delete file
if (!unlink($file)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not delete file'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'deleted' => true
]);