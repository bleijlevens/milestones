<?php

header('Content-Type: application/json');

$subjID = $_GET['ID'] ?? null;

if (!$subjID) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing participant ID'
    ]);
    exit;
}

$safeID = preg_replace('/[^A-Za-z0-9_-]/', '_', $subjID);

$file = __DIR__ . '/milestones-' . $safeID . '.csv';

if (!file_exists($file)) {
    echo json_encode([
        'success' => true,
        'exists' => false,
        'data' => []
    ]);
    exit;
}

$handle = fopen($file, 'r');

if ($handle === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not open file'
    ]);
    exit;
}

$headers = fgetcsv($handle);

$rows = [];

while (($row = fgetcsv($handle)) !== false) {
    $rows[] = array_combine($headers, $row);
}

fclose($handle);

echo json_encode([
    'success' => true,
    'exists' => true,
    'data' => $rows
]);