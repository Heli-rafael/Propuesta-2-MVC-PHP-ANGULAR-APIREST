<?php
require_once 'conexion.php';


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
            // Validar que exista password
            if (empty($data['password'])) {
                echo json_encode(['error' => 'La password es obligatoria']);
                return;
            }

            // Hashear la password antes de guardarla
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            $stmt = $this->pdo->prepare("
                INSERT INTO Usuario (nombre, correo, password, estado, id_rol) 
                VALUES (:nombre, :correo, :password, :estado, :id_rol)
            ");
            $stmt->execute([
                ':nombre' => $data['nombre'],
                ':correo' => $data['correo'],
                ':password' => $hashedPassword,
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
            $fields = [
                ':id' => $id,
                ':nombre' => $data['nombre'],
                ':correo' => $data['correo'],
                ':estado' => $data['estado'],
                ':id_rol' => $data['id_rol']
            ];

            $sql = "UPDATE Usuario SET nombre = :nombre, correo = :correo, estado = :estado, id_rol = :id_rol";

            // Si se proporciona password, la actualizamos también
            if (!empty($data['password'])) {
                $sql .= ", password = :password";
                $fields[':password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }

            $sql .= " WHERE id = :id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($fields);

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

    // Método opcional para verificar password al iniciar sesión
    public function verificarLogin($correo, $password) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Usuario WHERE correo = :correo");
            $stmt->execute([':correo' => $correo]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($password, $usuario['password'])) {
                echo json_encode(['success' => true, 'usuario' => $usuario]);
            } else {
                echo json_encode(['error' => 'Correo o password incorrectos']);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
?>
