<?php
require_once 'conexion.php';

class ReservasRecursos {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function obtenerPorReserva($id_reservas) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM Reservas_Recursos
                WHERE id_reservas = :id_reservas
            ");
            $stmt->execute([':id_reservas' => $id_reservas]);

            $recursos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($recursos);

        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>