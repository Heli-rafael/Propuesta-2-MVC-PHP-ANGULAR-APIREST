<?php

function validarUsuarioId($id) {
    $errores = [];
    if (empty($id)) {
        $errores[] = 'El ID es obligatorio.';
    } else if (!is_numeric($id) || $id <= 0) {
        $errores[] = 'El ID debe ser un número entero positivo.';
    }
    return $errores;
}

function validarUsuarioDatos($data) {
    $errores = [];
    

    if (empty($data['nombre'])) {
        $errores[] = 'El "nombre" es obligatorio.';
    } else if (strlen(trim($data['nombre'])) < 2) {
        $errores[] = 'El "nombre" debe tener al menos 2 caracteres.';
    }
    
 
    if (empty($data['correo'])) {
        $errores[] = 'El "correo" es obligatorio.';
    } else if (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'El formato del "correo" no es válido.';
    }
    
    
    if (isset($data['estado']) && !empty($data['estado'])) {
        $estadosValidos = ['Activo', 'Inactivo'];
        if (!in_array($data['estado'], $estadosValidos)) {
            $errores[] = "El 'estado' solo puede ser 'Activo' o 'Inactivo'.";
        }
    }
    
   
    if (isset($data['id_rol']) && !empty($data['id_rol'])) {
        if (!is_numeric($data['id_rol']) || $data['id_rol'] <= 0) {
            $errores[] = 'El "id_rol" debe ser un número entero positivo.';
        }
    }
    
    return $errores;
}

?>