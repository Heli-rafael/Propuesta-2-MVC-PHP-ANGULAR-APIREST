<?php
// Cabeceras para CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Permitir preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../componentes/usuarioreservas.php';

$usuarioReservas = new UsuarioReservas();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $usuarioReservas->listar();
        break;

    case 'obtener':
        $id_usuario = $_GET['id_usuario'] ?? 0;
        $id_reserva = $_GET['id_reserva'] ?? 0;
        $usuarioReservas->obtener($id_usuario, $id_reserva);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $usuarioReservas->crear($data);
        break;

    case 'eliminar':
        $id_usuario = $_GET['id_usuario'] ?? 0;
        $id_reserva = $_GET['id_reserva'] ?? 0;
        $usuarioReservas->eliminar($id_usuario, $id_reserva);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>