<?php
require_once 'conexion.php';
require_once __DIR__ . '/../validations/recurso.validations.php';


class Recursos {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM Recursos");
            $recursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($recursos);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Recursos WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $recurso = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($recurso);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
    
        $errores = RecursoValidation::validar($data);
    if (!empty($errores)) {
        echo json_encode(['errores' => $errores]);
        return;
    }
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO Recursos (nombre_recurso, cantidad, ubicacion, estado, prox_mantenimiento, id_tipo)
                VALUES (:nombre_recurso, :cantidad, :ubicacion, :estado, :prox_mantenimiento, :id_tipo)
            ");
            $stmt->execute([
                ':nombre_recurso' => $data['nombre_recurso'],
                ':cantidad' => $data['cantidad'] ?? 0,
                ':ubicacion' => $data['ubicacion'] ?? '',
                ':estado' => $data['estado'] ?? 'Disponible',
                ':prox_mantenimiento' => $data['prox_mantenimiento'] ?? null,
                ':id_tipo' => $data['id_tipo']
            ]);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
    $errores = RecursoValidation::validar($data);
        if (!empty($errores)) {
       echo json_encode(['errores' => $errores]);
         return;
    }
        try {
            $stmt = $this->pdo->prepare("
                UPDATE Recursos SET
                    nombre_recurso = :nombre_recurso,
                    cantidad = :cantidad,
                    ubicacion = :ubicacion,
                    estado = :estado,
                    prox_mantenimiento = :prox_mantenimiento,
                    id_tipo = :id_tipo
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':nombre_recurso' => $data['nombre_recurso'],
                ':cantidad' => $data['cantidad'] ?? 0,
                ':ubicacion' => $data['ubicacion'] ?? '',
                ':estado' => $data['estado'] ?? 'Disponible',
                ':prox_mantenimiento' => $data['prox_mantenimiento'] ?? null,
                ':id_tipo' => $data['id_tipo']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM Recursos WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>