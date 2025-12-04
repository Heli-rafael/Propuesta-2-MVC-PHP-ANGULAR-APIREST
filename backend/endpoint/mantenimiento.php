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

require_once 'componentes/mantenimiento.php';

$mantenimiento = new Mantenimiento();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $mantenimiento->listar();
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        $mantenimiento->obtener($id);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $mantenimiento->crear($data);
        break;

    case 'actualizar':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        $mantenimiento->actualizar($id, $data);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        $mantenimiento->eliminar($id);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>