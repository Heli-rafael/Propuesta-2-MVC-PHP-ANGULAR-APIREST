<?php
require_once 'conexion.php';

require_once __DIR__ . '/../validations/tiporecurso.validations.php';

class TipoRecurso {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM Tipo_Recurso");
            $tipos_recurso = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tipos_recurso);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Tipo_Recurso WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $tipo_recurso = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($tipo_recurso);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO Tipo_Recurso (nombre) VALUES (:nombre)");
            $stmt->execute([':nombre' => $data['nombre']]);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        try {
            $stmt = $this->pdo->prepare("UPDATE Tipo_Recurso SET nombre = :nombre WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':nombre' => $data['nombre']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM Tipo_Recurso WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>
