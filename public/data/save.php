<?php

header('Content-Type: application/json');

// --------------------------------------------------
// SERVER-SPECIFIC SETTING
// Change this path when deploying on another server.
// --------------------------------------------------
$dataDirectory = __DIR__;

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

// Check that valid JSON was received
if ($data === null) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON'
    ]);
    exit;
}

// Get participant ID
$subjID = $data['meta']['subjID'] ?? null;

if (!$subjID) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing participant ID'
    ]);
    exit;
}

// Make participant ID safe for use as a filename
$safeID = preg_replace('/[^A-Za-z0-9_-]/', '_', $subjID);

// Create CSV file path
$file = $dataDirectory . '/milestones-' . $safeID . '.csv';

// Open file for writing
$handle = fopen($file, 'w');

if ($handle === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not open file'
    ]);
    exit;
}

// CSV header
fputcsv($handle, [
    'subj_id',
    'child_name',
    'child_gender',
    'trial',
    'item_id',
    'label',
    'domain',
    'score',
    'timestamp'
]);

// CSV rows
foreach ($data['data'] as $trial) {
    fputcsv($handle, [
        $data['meta']['subjID'] ?? '',
        $data['meta']['childName'] ?? '',
        $data['meta']['childGender'] ?? '',
        $trial['trial'] ?? '',
        $trial['item_id'] ?? '',
        $trial['label'] ?? '',
        $trial['domain'] ?? '',
        $trial['score'] ?? '',
        $trial['timestamp'] ?? ''
    ]);
}

// Close file
fclose($handle);

// Tell the browser that saving succeeded
echo json_encode([
    'success' => true
]);