<?php
require_once 'conexion.php';
require_once __DIR__ . '/../validations/ubicacion.validations.php';

class Ubicacion {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM Ubicacion");
            $ubicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($ubicaciones);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Ubicacion WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $ubicacion = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($ubicacion);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        $validator = new UbicacionValidator($data);
        
        if (!$validator->validateDatos($data)) {
            http_response_code(400);
            echo json_encode(['errores' => $validator->getErrors()]);
            exit();
        }

        try {
            $stmt = $this->pdo->prepare("INSERT INTO Ubicacion (nombre) VALUES (:nombre)");
            $stmt->execute([':nombre' => $data['nombre']]);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        $idErrors = UbicacionValidator::validateId($id);
        
        if (!empty($idErrors)) {
            http_response_code(400); 
            echo json_encode(['errores' => $idErrors]);
            exit();
        }
        
        $validator = new UbicacionValidator($data);
        
        if (!$validator->validateDatos($data)) {
            http_response_code(400);
            echo json_encode(['errores' => $validator->getErrors()]);
            exit();
        }

        try {
            $stmt = $this->pdo->prepare("UPDATE Ubicacion SET nombre = :nombre WHERE id = :id");
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
            $stmt = $this->pdo->prepare("DELETE FROM Ubicacion WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>