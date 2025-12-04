<?php

function validarUsuarioReservasIds($id_usuario, $id_reserva) {
    $errores = [];
    
    if (empty($id_usuario)) {
        $errores[] = 'El ID del usuario es obligatorio.';
    } else if (!is_numeric($id_usuario) || $id_usuario <= 0) {
        $errores[] = 'El ID del usuario debe ser un número entero positivo.';
    }
    

    if (empty($id_reserva)) {
        $errores[] = 'El ID de la reserva es obligatorio.';
    } else if (!is_numeric($id_reserva) || $id_reserva <= 0) {
        $errores[] = 'El ID de la reserva debe ser un número entero positivo.';
    }
    
    return $errores;
}

function validarUsuarioReservasDatos($data) {
    $errores = [];
    
   
    if (empty($data['id_usuario'])) {
        $errores[] = 'El "id_usuario" es obligatorio.';
    } else if (!is_numeric($data['id_usuario']) || $data['id_usuario'] <= 0) {
        $errores[] = 'El "id_usuario" debe ser un número entero positivo.';
    }
    
 
    if (empty($data['id_reservas'])) {
        $errores[] = 'El "id_reservas" es obligatorio.';
    } else if (!is_numeric($data['id_reservas']) || $data['id_reservas'] <= 0) {
        $errores[] = 'El "id_reservas" debe ser un número entero positivo.';
    }
    
    return $errores;
}

?>