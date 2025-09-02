<?php
require_once 'db/db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? null;
$book_id = $_POST['book_id'] ?? $_GET['book_id'] ?? null;

if (!$user_id || !$book_id) {
    echo json_encode(['error' => 'Missing user_id or book_id']);
    exit();
}

$status = $_POST['status'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save or update status
    $stmt = $conn->prepare('INSERT INTO reading_history (user_id, book_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)');
    if (!$stmt) {
        echo json_encode(['error' => $conn->error]);
        exit();
    }
    $stmt->bind_param('iis', $user_id, $book_id, $status);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    $stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare('SELECT status FROM reading_history WHERE user_id = ? AND book_id = ?');
    if (!$stmt) {
        echo json_encode(['error' => $conn->error]);
        exit();
    }
    $stmt->bind_param('ii', $user_id, $book_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        echo json_encode(['status' => $row['status']]);
    } else {
        echo json_encode(['status' => null]);
    }
    $stmt->close();
    exit();
}

echo json_encode(['error' => 'Invalid request']);
exit();
