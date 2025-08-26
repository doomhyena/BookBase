<?php
    // CORS + cookie engedélyezés
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');

    // Ha van cookie
    if (isset($_COOKIE['id'])) {
        echo json_encode([
            "success" => true,
            "cookie_id" => $_COOKIE['id']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Nincs id cookie a request-ben!"
        ]);
    }
