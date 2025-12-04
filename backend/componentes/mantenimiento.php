<?php
require_once 'conexion.php';
require_once '../validations/mantenimiento.validations.php';

class Mantenimiento {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("
                SELECT m.*, r.nombre_recurso 
                FROM Mantenimiento m
                LEFT JOIN Recursos r ON m.id_recursos = r.id
            ");
            $mantenimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($mantenimientos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        $errores = validarMantenimientoId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Mantenimiento WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $mantenimiento = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($mantenimiento);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        $errores = validarMantenimientoDatos($data);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO Mantenimiento (fecha, costo, descripcion, prox_mantenimiento, id_recursos)
                VALUES (:fecha, :costo, :descripcion, :prox_mantenimiento, :id_recursos)
            ");
            $stmt->execute([
                ':fecha' => $data['fecha'],
                ':costo' => $data['costo'],
                ':descripcion' => $data['descripcion'],
                ':prox_mantenimiento' => $data['prox_mantenimiento'] ?? null,
                ':id_recursos' => $data['id_recursos']
            ]);
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        $errores_id = validarMantenimientoId($id);
        $errores_data = validarMantenimientoDatos($data);
        $errores = array_merge($errores_id, $errores_data);

        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                UPDATE Mantenimiento 
                SET fecha = :fecha,
                    costo = :costo,
                    descripcion = :descripcion,
                    prox_mantenimiento = :prox_mantenimiento,
                    id_recursos = :id_recursos
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':fecha' => $data['fecha'],
                ':costo' => $data['costo'],
                ':descripcion' => $data['descripcion'],
                ':prox_mantenimiento' => $data['prox_mantenimiento'] ?? null,
                ':id_recursos' => $data['id_recursos']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        $errores = validarMantenimientoId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("DELETE FROM Mantenimiento WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>