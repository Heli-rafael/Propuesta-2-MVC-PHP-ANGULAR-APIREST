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

require_once '../componentes/roles.php';
require_once '../validations/roles.validations.php';

$roles = new Roles();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $roles->listar();
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        $roles->obtener($id);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $valid = validarRoles($data);
        if (isset($valid['error'])) {
            echo json_encode($valid);
            exit();
        }
        $roles->crear($data);
        break;

    case 'actualizar':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        $roles->actualizar($id, $data);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        $roles->eliminar($id);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>

