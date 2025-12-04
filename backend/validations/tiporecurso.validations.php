<?php

function validarTipoRecurso($data) {

    if (!isset($data['nombre']) || empty(trim($data['nombre']))) {
        return ['error' => 'El nombre del tipo de recurso es obligatorio'];
    }

    return ['success' => true];
}

?>