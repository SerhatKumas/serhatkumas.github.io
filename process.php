<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "serhatkumas@outlook.com";

    // Sanitize inputs
    $from = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');

    // Validate email
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
        echo "error";
        exit;
    }

    // Email headers
    $headers = "From: no-reply@yourdomain.com\r\n"; 
    $headers .= "Reply-To: $from\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Subject & body
    $subject = "New Contact Form Message from $name";
    $body = "You have received a new message from your website contact form.\r\n\r\n";
    $body .= "Name: $name\r\n";
    $body .= "Email: $from\r\n";
    $body .= "Phone: $phone\r\n";
    $body .= "Message:\r\n$message\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    echo "error";
}
?>