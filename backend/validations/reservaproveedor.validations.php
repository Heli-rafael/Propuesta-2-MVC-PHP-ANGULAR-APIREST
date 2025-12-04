<?php

class ReservasProveedorValidation {

    public static function validar($data) {
        $errores = [];

 
        if (empty($data['id_reservas'])) {
            $errores['id_reservas'] = 'El ID de la reserva es obligatorio.';
        } elseif (!filter_var($data['id_reservas'], FILTER_VALIDATE_INT)) {
            $errores['id_reservas'] = 'El ID de la reserva debe ser un número entero.';
        } elseif ($data['id_reservas'] <= 0) {
            $errores['id_reservas'] = 'El ID de la reserva debe ser mayor a 0.';
        }

      
        if (empty($data['id_proveedores'])) {
            $errores['id_proveedores'] = 'El ID del proveedor es obligatorio.';
        } elseif (!filter_var($data['id_proveedores'], FILTER_VALIDATE_INT)) {
            $errores['id_proveedores'] = 'El ID del proveedor debe ser un número entero.';
        } elseif ($data['id_proveedores'] <= 0) {
            $errores['id_proveedores'] = 'El ID del proveedor debe ser mayor a 0.';
        }

        return $errores;
    }
}

?>
