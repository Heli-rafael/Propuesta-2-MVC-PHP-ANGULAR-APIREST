<?php

class ReservasValidation {

    public static function validar($data) {
        $errores = [];

  
        if (empty($data['fecha'])) {
            $errores['fecha'] = 'La fecha es obligatoria.';
        } elseif (!self::validarFecha($data['fecha'])) {
            $errores['fecha'] = 'La fecha debe tener el formato YYYY-MM-DD.';
        }

 
        if (!isset($data['numero_asistentes'])) {
            $errores['numero_asistentes'] = 'El número de asistentes es obligatorio.';
        } elseif (!is_numeric($data['numero_asistentes']) || $data['numero_asistentes'] < 1) {
            $errores['numero_asistentes'] = 'Debe ser un número entero mayor o igual a 1.';
        }


        if (!isset($data['total'])) {
            $errores['total'] = 'El total es obligatorio.';
        } elseif (!is_numeric($data['total']) || $data['total'] < 0) {
            $errores['total'] = 'El total debe ser un número mayor o igual a 0.';
        }

      
        $estados_validos = ['Cancelada', 'Con Adelanto', 'Por Pagar', 'Pagada'];
        if (!empty($data['estado']) && !in_array($data['estado'], $estados_validos)) {
            $errores['estado'] = 'El estado no es válido.';
        }


        if (empty($data['id_cliente']) || !is_numeric($data['id_cliente']) || $data['id_cliente'] <= 0) {
            $errores['id_cliente'] = 'Debe seleccionar un cliente válido.';
        }


        if (empty($data['id_pagos']) || !is_numeric($data['id_pagos']) || $data['id_pagos'] <= 0) {
            $errores['id_pagos'] = 'Debe seleccionar un tipo de pago válido.';
        }

     
        if (empty($data['id_evento']) || !is_numeric($data['id_evento']) || $data['id_evento'] <= 0) {
            $errores['id_evento'] = 'Debe seleccionar un evento válido.';
        }

    
        if (empty($data['id_ubicacion']) || !is_numeric($data['id_ubicacion']) || $data['id_ubicacion'] <= 0) {
            $errores['id_ubicacion'] = 'Debe seleccionar una ubicación válida.';
        }

        return $errores;
    }


    private static function validarFecha($fecha) {
        $d = DateTime::createFromFormat('Y-m-d', $fecha);
        return $d && $d->format('Y-m-d') === $fecha;
    }
}

?>
