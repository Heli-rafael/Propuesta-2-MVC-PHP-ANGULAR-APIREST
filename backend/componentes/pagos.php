<?php
require_once 'conexion.php';
require_once '../validations/pagos.validations.php';

class Pagos {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("
                SELECT p.id, p.id_tipo_pago, p.id_adelanto,
                       tp.nombre AS tipo_pago,
                       a.valor AS adelanto
                FROM Pagos p
                LEFT JOIN Tipo_Pago tp ON p.id_tipo_pago = tp.id
                LEFT JOIN Adelanto a ON p.id_adelanto = a.id
            ");
            $pagos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($pagos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        $errores = validarPagoId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("SELECT id, id_tipo_pago, id_adelanto FROM Pagos WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $pago = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($pago);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        $errores = validarPagoDatos($data);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO Pagos (id_tipo_pago, id_adelanto)
                VALUES (:id_tipo_pago, :id_adelanto)
            ");
            $stmt->execute([
                ':id_tipo_pago' => $data['id_tipo_pago'],
                ':id_adelanto' => $data['id_adelanto']
            ]);
            http_response_code(201);
            echo json_encode(['success' => true, 'id' => $this->pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        $errores_id = validarPagoId($id);
        $errores_data = validarPagoDatos($data);
        $errores = array_merge($errores_id, $errores_data);

        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("
                UPDATE Pagos SET
                    id_tipo_pago = :id_tipo_pago,
                    id_adelanto = :id_adelanto
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':id_tipo_pago' => $data['id_tipo_pago'],
                ':id_adelanto' => $data['id_adelanto']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        $errores = validarPagoId($id);
        if (!empty($errores)) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos no válidos', 'detalles' => $errores]);
            return;
        }

        try {
            $stmt = $this->pdo->prepare("DELETE FROM Pagos WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>
