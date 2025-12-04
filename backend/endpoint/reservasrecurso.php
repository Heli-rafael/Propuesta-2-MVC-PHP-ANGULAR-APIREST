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

require_once '../componentes/reservasrecurso.php';
require_once '../validations/reservarecurso.validations.php';

$reservasRecursos = new ReservasRecursos();
$accion = $_GET['accion'] ?? '';

switch ($accion) {
        
    case 'obtenerPorReserva':
        $id_reservas = $_GET['id_reservas'] ?? 0;
        $reservasRecursos->obtenerPorReserva($id_reservas);
        break;
        
    default:
        echo json_encode(['error' => 'Acción no válida']);
}

?>