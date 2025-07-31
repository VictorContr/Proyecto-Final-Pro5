<?php
// php/contact.php
header('Content-Type: application/json');

// Asegúrate de que estas rutas sean correctas según tu estructura de archivos
require __DIR__ . '/libs/vendor/autoload.php'; 

// Cargar Dotenv para variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Cargar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Sanitizar y validar datos
$name_vc_jc = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$email_vc_jc = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$message_vc_jc = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

if (!$name_vc_jc || !$email_vc_jc || !$message_vc_jc || !filter_var($email_vc_jc, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, completa todos los campos correctamente.'
    ]);
    exit;
}

$mail_vc_jc = new PHPMailer(true);

try {
    // Configuración SMTP
    $mail_vc_jc->SMTPDebug = SMTP::DEBUG_OFF; // Cambiado a OFF para producción
    $mail_vc_jc->isSMTP();
    $mail_vc_jc->Host = 'smtp.gmail.com';
    $mail_vc_jc->SMTPAuth = true;
    $mail_vc_jc->Username = $_ENV['MAIL_USERNAME'];
    $mail_vc_jc->Password =  $_ENV['MAIL_PASSWORD'];
    $mail_vc_jc->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Para puerto 587
    $mail_vc_jc->Port = 587;

    // Recipientes
    $mail_vc_jc->setFrom('info@Game-Enjoyers.com', 'Game Enjoyers');
    $mail_vc_jc->addAddress($email_vc_jc); // Destinatario
    $mail_vc_jc->addReplyTo($email_vc_jc, $name_vc_jc); // Para poder responder al remitente

    // Contenido
    $mail_vc_jc->isHTML(true);
    $mail_vc_jc->Subject = "Nuevo mensaje de contacto desde la web";
    $mail_vc_jc->Body = "
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> {$name_vc_jc}</p>
        <p><strong>Email:</strong> {$email_vc_jc}</p>
        <p><strong>Mensaje:</strong><br>{$message_vc_jc}</p>
    ";
    $mail_vc_jc->AltBody = "Nombre: {$name_vc_jc}\nEmail: {$email_vc_jc}\nMensaje:\n{$message_vc_jc}";

    $mail_vc_jc->send();

    echo json_encode([
        'success' => true,
        'message' => '¡Mensaje enviado correctamente! Pronto te contactaremos.'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el mensaje. Error: ' . $mail_vc_jc->ErrorInfo
    ]);
}