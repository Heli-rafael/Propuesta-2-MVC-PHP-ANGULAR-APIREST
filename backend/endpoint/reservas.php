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

require_once '../componentes/reservas.php';
require_once '../validations/reserva.validations.php';

$reservas = new Reservas();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $reservas->listar();
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        $reservas->obtener($id);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $reservas->crear($data);
        break;

    case 'actualizar':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        $reservas->actualizar($id, $data);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        $reservas->eliminar($id);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>