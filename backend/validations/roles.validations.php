<?php

function validarRoles($data) {

    if (!isset($data['nombre']) || strlen(trim($data['nombre'])) === 0) {
        return ['error' => 'El nombre del rol es obligatorio'];
    }

    if (strlen($data['nombre']) > 50) {
        return ['error' => 'El nombre del rol no puede superar 50 caracteres'];
    }

    return ['success' => true];
}

?>