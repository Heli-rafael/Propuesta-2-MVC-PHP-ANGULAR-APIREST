<?php

function validarClienteId($id) {
    $errores = [];
    if (empty($id)) {
        $errores[] = 'El ID es obligatorio.';
    } else if (!is_numeric($id) || $id <= 0 || intval($id) != $id) {
        $errores[] = 'El ID debe ser un número entero positivo.';
    }
    return $errores;
}

function validarClienteDatos($data) {
    $errores = [];

    // Validación de nombre
    if (empty($data['nombre'])) {
        $errores[] = 'El "nombre" es obligatorio.';
    } else if (strlen($data['nombre']) > 100) {
        $errores[] = 'El "nombre" no puede exceder 100 caracteres.';
    }

    // Validación de apellidos
    if (empty($data['apellidos'])) {
        $errores[] = 'Los "apellidos" son obligatorios.';
    } else if (strlen($data['apellidos']) > 100) {
        $errores[] = 'Los "apellidos" no pueden exceder 100 caracteres.';
    }

    // Validación de teléfono
    if (empty($data['telefono'])) {
        $errores[] = 'El "telefono" es obligatorio.';
    } else if (!is_numeric($data['telefono']) || strlen($data['telefono']) != 9) {
        $errores[] = 'El "telefono" debe ser un número de 9 dígitos.';
    }

    // Validación de DNI
    if (empty($data['dni'])) {
        $errores[] = 'El "DNI" es obligatorio.';
    } else if (!is_numeric($data['dni']) || strlen($data['dni']) != 8) {
        $errores[] = 'El "DNI" debe ser un número de 8 dígitos.';
    }

    // Validación de correo
    if (empty($data['correo'])) {
        $errores[] = 'El "Correo" es obligatorio.';
    } else if (strlen($data['correo']) > 100) {
        $errores[] = 'El "Correo" no puede exceder 100 caracteres.';
    } else if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El "Correo" no tiene un formato válido.';
    }

    return $errores;
}
?>
