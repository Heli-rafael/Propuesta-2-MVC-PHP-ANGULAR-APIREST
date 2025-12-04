<?php
require_once 'conexion.php';
require_once __DIR__ . '/../validations/usuario.validations.php';

class Usuario {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT u.id, u.nombre, u.correo, u.fecha_registro, u.estado, r.nombre AS rol FROM Usuario u LEFT JOIN Roles r ON u.id_rol = r.id");
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($usuarios);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT u.id, u.nombre, u.correo, u.fecha_registro, u.estado, r.nombre AS rol FROM Usuario u LEFT JOIN Roles r ON u.id_rol = r.id WHERE u.id = :id");
            $stmt->execute([':id' => $id]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($usuario);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO Usuario (nombre, correo, estado, id_rol) VALUES (:nombre, :correo, :estado, :id_rol)");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':correo' => $data['correo'],
                ':estado' => $data['estado'] ?? 'Activo',
                ':id_rol' => $data['id_rol'] ?? null
            ]);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        try {
            $stmt = $this->pdo->prepare("UPDATE Usuario SET nombre = :nombre, correo = :correo, estado = :estado, id_rol = :id_rol WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':nombre' => $data['nombre'],
                ':correo' => $data['correo'],
                ':estado' => $data['estado'],
                ':id_rol' => $data['id_rol']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM Usuario WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>