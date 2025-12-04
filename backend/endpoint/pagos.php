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

require_once '../componentes/pagos.php';
require_once '../validations/pagos.validations.php';

$pagos = new Pagos();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $pagos->listar();
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        $pagos->obtener($id);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $pagos->crear($data);
        break;

    case 'actualizar':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        $pagos->actualizar($id, $data);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        $pagos->eliminar($id);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>