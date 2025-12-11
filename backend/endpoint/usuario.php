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

require_once '../componentes/usuario.php';
require_once '../validations/usuario.validations.php';


$usuario = new Usuario();
$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'listar':
        $usuario->listar();
        break;

    case 'obtener':
        $id = $_GET['id'] ?? 0;
        $usuario->obtener($id);
        break;

    case 'crear':
        $data = json_decode(file_get_contents('php://input'), true);
        $usuario->crear($data);
        break;

    case 'actualizar':
        $id = $_GET['id'] ?? 0;
        $data = json_decode(file_get_contents('php://input'), true);
        $usuario->actualizar($id, $data);
        break;

    case 'eliminar':
        $id = $_GET['id'] ?? 0;
        $usuario->eliminar($id);
        break;

    case 'checksession':
        session_start();
        if (isset($_SESSION['user'])) {
            echo json_encode(['logged' => true, 'user' => $_SESSION['user']]);
        } else {
            echo json_encode(['logged' => false]);
        }
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>