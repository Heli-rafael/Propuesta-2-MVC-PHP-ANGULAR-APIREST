<?php
require_once 'conexion.php';
require_once __DIR__ . '/../validations/reserva.validations.php';

class Reservas {
    private $pdo;

    public function __construct() {
        $db = new Conexion();
        $this->pdo = $db->iniciar();
    }

    public function listar() {
        try {
            $stmt = $this->pdo->query("SELECT * FROM Reservas");
            $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($reservas);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function obtener($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM Reservas WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $reserva = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($reserva);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function crear($data) {
        $errores = ReservasValidation::validar($data);
        if (!empty($errores)) {
            echo json_encode(['errores' => $errores]);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            // 1. Crear pago
            $stmtPago = $this->pdo->prepare("
                INSERT INTO Pagos (id_tipo_pago, id_adelanto)
                VALUES (:id_tipo_pago, :id_adelanto)
            ");
            $stmtPago->execute([
                ':id_tipo_pago' => $data['id_tipo_pago'],
                ':id_adelanto' => $data['id_adelanto']
            ]);
            $id_pago = $this->pdo->lastInsertId();

            // 2. Crear reserva
            $stmt = $this->pdo->prepare("
                INSERT INTO Reservas (fecha, numero_asistentes, total, estado, id_cliente, id_pagos, id_evento, id_ubicacion)
                VALUES (:fecha, :numero_asistentes, :total, :estado, :id_cliente, :id_pagos, :id_evento, :id_ubicacion)
            ");
            $stmt->execute([
                ':fecha' => $data['fecha'],
                ':numero_asistentes' => $data['numero_asistentes'] ?? 0,
                ':total' => $data['total'] ?? 0,
                ':estado' => $data['estado'] ?? 'Por Pagar',
                ':id_cliente' => $data['id_cliente'],
                ':id_pagos' => $id_pago,
                ':id_evento' => $data['id_evento'],
                ':id_ubicacion' => $data['id_ubicacion']
            ]);
            $id_reserva = $this->pdo->lastInsertId();

            // 3. Asociar recursos seleccionados
            if (!empty($data['recursos']) && is_array($data['recursos'])) {

                // Insertar relación recurso-reserva
                $stmtRec = $this->pdo->prepare("
                    INSERT INTO Reservas_Recursos (id_reservas, id_recursos)
                    VALUES (:id_reserva, :id_recurso)
                ");

                // Cambiar estado del recurso a En uso
                $stmtUpdate = $this->pdo->prepare("
                    UPDATE Recursos SET estado = 'En uso'
                    WHERE id = :id_recurso
                ");

                foreach ($data['recursos'] as $id_recurso) {

                    // Insertar relación
                    $stmtRec->execute([
                        ':id_reserva' => $id_reserva,
                        ':id_recurso' => $id_recurso
                    ]);

                    // Cambiar estado del recurso
                    $stmtUpdate->execute([
                        ':id_recurso' => $id_recurso
                    ]);
                }
            }

            // 4. Asociar proveedores seleccionados
            if (!empty($data['proveedores']) && is_array($data['proveedores'])) {
                $stmtProv = $this->pdo->prepare("
                    INSERT INTO Reservas_Proveedor (id_reservas, id_proveedores)
                    VALUES (:id_reserva, :id_proveedor)
                ");
                foreach ($data['proveedores'] as $id_proveedor) {
                    $stmtProv->execute([
                        ':id_reserva' => $id_reserva,
                        ':id_proveedor' => $id_proveedor
                    ]);
                }
            }

            $this->pdo->commit();

            echo json_encode([
                'success' => true,
                'id' => $id_reserva,
                'id_pago' => $id_pago
            ]);

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function actualizar($id, $data) {
        $errores = ReservasValidation::validar($data);
        if (!empty($errores)) {
            echo json_encode(['errores' => $errores]);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            // Obtener id_pagos
            $stmtReserva = $this->pdo->prepare("SELECT id_pagos FROM Reservas WHERE id = :id");
            $stmtReserva->execute([':id' => $id]);
            $reservaActual = $stmtReserva->fetch(PDO::FETCH_ASSOC);

            if (!$reservaActual) {
                echo json_encode(['error' => 'Reserva no encontrada']);
                return;
            }
            $id_pago = $reservaActual['id_pagos'];

            // Actualizar pago
            $stmtPago = $this->pdo->prepare("
                UPDATE Pagos SET
                    id_tipo_pago = :id_tipo_pago,
                    id_adelanto = :id_adelanto
                WHERE id = :id_pago
            ");
            $stmtPago->execute([
                ':id_tipo_pago' => $data['id_tipo_pago'],
                ':id_adelanto' => $data['id_adelanto'],
                ':id_pago' => $id_pago
            ]);

            // Actualizar reserva
            $stmt = $this->pdo->prepare("
                UPDATE Reservas SET
                    fecha = :fecha,
                    numero_asistentes = :numero_asistentes,
                    total = :total,
                    estado = :estado,
                    id_cliente = :id_cliente,
                    id_evento = :id_evento,
                    id_ubicacion = :id_ubicacion
                WHERE id = :id
            ");
            $stmt->execute([
                ':id' => $id,
                ':fecha' => $data['fecha'],
                ':numero_asistentes' => $data['numero_asistentes'] ?? 0,
                ':total' => $data['total'] ?? 0,
                ':estado' => $data['estado'] ?? 'Por Pagar',
                ':id_cliente' => $data['id_cliente'],
                ':id_evento' => $data['id_evento'],
                ':id_ubicacion' => $data['id_ubicacion']
            ]);

            // Actualizar recursos: borrar antiguos y agregar nuevos
            
            // 1. Obtener recursos que estaban asignados antes
            $stmtOld = $this->pdo->prepare("
                SELECT id_recursos FROM Reservas_Recursos WHERE id_reservas = :id_reserva
            ");
            $stmtOld->execute([':id_reserva' => $id]);
            $recursosAntiguos = $stmtOld->fetchAll(PDO::FETCH_COLUMN);

            // 2. Cambiar antiguos a 'Disponible'
            $stmtDisponible = $this->pdo->prepare("
                UPDATE Recursos SET estado = 'Disponible'
                WHERE id = :id_recurso
            ");
            foreach ($recursosAntiguos as $id_recurso_antiguo) {
                $stmtDisponible->execute([':id_recurso' => $id_recurso_antiguo]);
            }

            // 3. Borrar relaciones anteriores
            $this->pdo->prepare("
                DELETE FROM Reservas_Recursos WHERE id_reservas = :id_reserva
            ")->execute([':id_reserva' => $id]);

            // 4. Insertar nuevos recursos
            if (!empty($data['recursos']) && is_array($data['recursos'])) {
                
                $stmtRec = $this->pdo->prepare("
                    INSERT INTO Reservas_Recursos (id_reservas, id_recursos)
                    VALUES (:id_reserva, :id_recurso)
                ");

                $stmtEnUso = $this->pdo->prepare("
                    UPDATE Recursos SET estado = 'En uso'
                    WHERE id = :id_recurso
                ");

                foreach ($data['recursos'] as $id_recurso) {

                    // Insertar nuevo recurso asignado
                    $stmtRec->execute([
                        ':id_reserva' => $id,
                        ':id_recurso' => $id_recurso
                    ]);

                    // Cambiar estado del recurso
                    $stmtEnUso->execute([
                        ':id_recurso' => $id_recurso
                    ]);
                }
            }

            // Actualizar proveedores: borrar antiguos y agregar nuevos
            $this->pdo->prepare("DELETE FROM Reservas_Proveedor WHERE id_reservas = :id_reserva")
                ->execute([':id_reserva' => $id]);
            if (!empty($data['proveedores']) && is_array($data['proveedores'])) {
                $stmtProv = $this->pdo->prepare("
                    INSERT INTO Reservas_Proveedor (id_reservas, id_proveedores)
                    VALUES (:id_reserva, :id_proveedor)
                ");
                foreach ($data['proveedores'] as $id_proveedor) {
                    $stmtProv->execute([
                        ':id_reserva' => $id,
                        ':id_proveedor' => $id_proveedor
                    ]);
                }
            }

            $this->pdo->commit();
            echo json_encode(['success' => true]);

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function eliminar($id) {
        try {
            $this->pdo->beginTransaction();

            // 1. Obtener la reserva y su id_pago
            $stmtReserva = $this->pdo->prepare("SELECT id_pagos FROM Reservas WHERE id = :id");
            $stmtReserva->execute([':id' => $id]);
            $reserva = $stmtReserva->fetch(PDO::FETCH_ASSOC);

            if (!$reserva) {
                echo json_encode(['error' => 'Reserva no encontrada']);
                return;
            }

            $id_pago = $reserva['id_pagos'];

            // 2. Obtener recursos asociados para restablecer su estado
            $stmtRecursos = $this->pdo->prepare("SELECT id_recursos FROM Reservas_Recursos WHERE id_reservas = :id_reserva");
            $stmtRecursos->execute([':id_reserva' => $id]);
            $recursos = $stmtRecursos->fetchAll(PDO::FETCH_COLUMN);

            // 3. Cambiar estado de los recursos a 'Disponible'
            if (!empty($recursos)) {
                $stmtDisponible = $this->pdo->prepare("UPDATE Recursos SET estado = 'Disponible' WHERE id = :id_recurso");
                foreach ($recursos as $id_recurso) {
                    $stmtDisponible->execute([':id_recurso' => $id_recurso]);
                }
            }

            // 4. Eliminar relaciones con recursos y proveedores
            $this->pdo->prepare("DELETE FROM Reservas_Recursos WHERE id_reservas = :id_reserva")
                    ->execute([':id_reserva' => $id]);
            $this->pdo->prepare("DELETE FROM Reservas_Proveedor WHERE id_reservas = :id_reserva")
                    ->execute([':id_reserva' => $id]);

            // 5. Eliminar la reserva
            $this->pdo->prepare("DELETE FROM Reservas WHERE id = :id")
                    ->execute([':id' => $id]);

            // 6. Eliminar el pago asociado
            $this->pdo->prepare("DELETE FROM Pagos WHERE id = :id_pago")
                    ->execute([':id_pago' => $id_pago]);

            $this->pdo->commit();

            echo json_encode(['success' => true]);

        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

?>