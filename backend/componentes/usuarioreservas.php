<?php
require_once 'conexion.php';

class UsuarioReservas {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("
                SELECT ur.id_usuario, u.nombre AS usuario, ur.id_reservas, r.fecha AS fecha_reserva
                FROM Usuario_Reservas ur
                LEFT JOIN Usuario u ON ur.id_usuario = u.id
                LEFT JOIN Reservas r ON ur.id_reservas = r.id
            ");
            $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($datos);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id_usuario, $id_reserva) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM Usuario_Reservas 
                WHERE id_usuario = :id_usuario AND id_reservas = :id_reservas
            ");
            $stmt->execute([
                ':id_usuario' => $id_usuario,
                ':id_reservas' => $id_reserva
            ]);
            $dato = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($dato);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO Usuario_Reservas (id_usuario, id_reservas) VALUES (:id_usuario, :id_reservas)");
            $stmt->execute([
                ':id_usuario' => $data['id_usuario'],
                ':id_reservas' => $data['id_reservas']
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id_usuario, $id_reserva) {
        try {
            $stmt = $this->pdo->prepare("
                DELETE FROM Usuario_Reservas 
                WHERE id_usuario = :id_usuario AND id_reservas = :id_reservas
            ");
            $stmt->execute([
                ':id_usuario' => $id_usuario,
                ':id_reservas' => $id_reserva
            ]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>