<?php

function validarTipoPago($data) {

    if (!isset($data['nombre']) || empty(trim($data['nombre']))) {
        return ['error' => 'El nombre del tipo de pago es obligatorio'];
    }

    return ['success' => true];
}

?>