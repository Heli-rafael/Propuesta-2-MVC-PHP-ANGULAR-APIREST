<?php
require_once 'conexion.php';
require_once __DIR__ . '/../validations/reservaproveedor.validations.php';


class ReservasProveedor {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function obtenerPorReserva($id_reservas) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM Reservas_Proveedor 
                WHERE id_reservas = :id_reservas
            ");
            $stmt->execute([':id_reservas' => $id_reservas]);

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

}

?>