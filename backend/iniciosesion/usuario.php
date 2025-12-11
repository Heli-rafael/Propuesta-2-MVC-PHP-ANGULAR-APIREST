<?php
// Cabeceras para CORS
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$accion = $_GET['accion'] ?? '';

switch($accion) {
    case 'checksession':
        session_start();
        if (isset($_SESSION['user'])) {
            echo json_encode(['logged' => true, 'user' => $_SESSION['user']]);
        } else {
            echo json_encode(['logged' => false]);
        }
        break;
    
    case 'login':
        session_start();
        require_once 'conexion.php';

        $db = new Conexion();
        $pdo = $db->iniciar();
        $body = json_decode(file_get_contents('php://input'), true);

        $correo = $body['correo'] ?? '';
        $pass = $body['contrasena'] ?? '';

        $query = "SELECT * FROM Usuario WHERE correo = :correo LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        // && password_verify($pass, $user['password'])
        if ($user && password_verify($pass, $user['password'])) {

            $update = $pdo->prepare("UPDATE Usuario SET estado = 'Activo' WHERE id = :id");
            $update->bindParam(':id', $user['id']);
            $update->execute();
            
            $_SESSION['user'] = $user['nombre'];
            $_SESSION['correo'] = $user['correo'];
            $_SESSION['rol'] = $user['id_rol'];

            echo json_encode([
                'success' => true,
                'user' => $user['nombre'],
                'correo' => $user['correo'],
                'rol' => $user['id_rol']
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ]);
        }
        break;
        
    case 'logout':
        session_start();

        require_once 'conexion.php';
        $db = new Conexion();
        $pdo = $db->iniciar();

        if (isset($_SESSION['correo'])) {
            $correo = $_SESSION['correo'];

            // 🔥 Cambiar estado a Inactivo
            $update = $pdo->prepare("UPDATE Usuario SET estado = 'Inactivo' WHERE correo = :correo");
            $update->bindParam(':correo', $correo);
            $update->execute();
        }

        // Destruye sesión
        $_SESSION = [];
        session_destroy();

        echo json_encode(['success' => true, 'message' => 'Sesión cerrada correctamente']);
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
}
