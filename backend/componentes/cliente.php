<?php
require_once 'conexion.php';
require_once '../validations/cliente.validations.php';

class Cliente {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM Cliente");
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($clientes);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        $errores = validarClienteId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Cliente WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($cliente);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        $errores = validarClienteDatos($data);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO Cliente (nombre, apellidos, telefono, dni, correo) 
                VALUES (:nombre, :apellidos, :telefono, :dni, :correo)
            ");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':apellidos' => $data['apellidos'],
                ':telefono' => $data['telefono'],
                ':dni' => $data['dni'],
                ':correo' => $data['correo']
            ]);
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        $errores_id = validarClienteId($id);
        $errores_data = validarClienteDatos($data);
        $errores = array_merge($errores_id, $errores_data);

        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                UPDATE Cliente 
                SET nombre = :nombre, apellidos = :apellidos, telefono = :telefono, dni = :dni, correo = :correo
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':nombre' => $data['nombre'],
                ':apellidos' => $data['apellidos'],
                ':telefono' => $data['telefono'],
                ':dni' => $data['dni'],
                ':correo' => $data['correo']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        $errores = validarClienteId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("DELETE FROM Cliente WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>