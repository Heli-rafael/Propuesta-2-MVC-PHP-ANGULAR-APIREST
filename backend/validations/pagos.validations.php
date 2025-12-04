<?php

function validarPagoId($id) {
    $errores = [];
    if (empty($id)) {
        $errores[] = 'El ID es obligatorio.';
    } else if (!is_numeric($id) || $id <= 0) {
        $errores[] = 'El ID debe ser un número entero positivo.';
    }
    return $errores;
}

function validarPagoDatos($data) {
    $errores = [];
    if (empty($data['id_tipo_pago'])) {
        $errores[] = 'El "id_tipo_pago" es obligatorio.';
    } else if (!is_numeric($data['id_tipo_pago'])) {
        $errores[] = 'El "id_tipo_pago" debe ser un ID válido.';
    }
    if (empty($data['id_adelanto'])) {
        $errores[] = 'El "id_adelanto" es obligatorio.';
    } else if (!is_numeric($data['id_adelanto'])) {
        $errores[] = 'El "id_adelanto" debe ser un ID válido.';
    }
    return $errores;
}
?>