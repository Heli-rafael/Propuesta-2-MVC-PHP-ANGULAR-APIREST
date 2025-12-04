<?php

function validarReservasRecursos($data) {

    if (!isset($data['id_reserva']) || !is_numeric($data['id_reserva'])) {
        return ['error' => 'El ID de la reserva es obligatorio y debe ser numérico'];
    }

    if (!isset($data['id_recurso']) || !is_numeric($data['id_recurso'])) {
        return ['error' => 'El ID del recurso es obligatorio y debe ser numérico'];
    }

    if (!isset($data['cantidad']) || !is_numeric($data['cantidad']) || $data['cantidad'] <= 0) {
        return ['error' => 'La cantidad debe ser un número mayor a 0'];
    }

    return ['success' => true];
}

?>