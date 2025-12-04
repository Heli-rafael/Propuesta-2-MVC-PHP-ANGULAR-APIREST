<?php

class RecursoValidation {

    public static function validar($data) {
        $errores = [];

    
        if (empty($data['nombre_recurso'])) {
            $errores['nombre_recurso'] = 'El nombre  obligatorio.';
        } elseif (strlen($data['nombre_recurso']) < 3) {
            $errores['nombre_recurso'] = 'Tiene qiue ser mayor a 3 caracteres.';
        }

     
        if (!isset($data['cantidad'])) {
            $errores['cantidad'] = 'La cantidad es obligatoria.';
        } elseif (!is_numeric($data['cantidad']) || $data['cantidad'] < 0) {
               $errores['cantidad'] = 'La cantidad debe ser un número mayor o igual a 0.';
        }

        if (!empty($data['ubicacion']) && strlen($data['ubicacion']) < 3) {
            $errores['ubicacion'] = 'La ubicación debe tener al menos 3 caracteres.';
        }

     
        $estados_validos = ['Disponible', 'No disponible', 'En uso', 'Mantenimiento'];
        if (!empty($data['estado']) && !in_array($data['estado'], $estados_validos)) {
              $errores['estado'] = 'El estado proporcionado no es válido.';
        }

   
        if (!empty($data['prox_mantenimiento'])) {
            // Si viene como timestamp o string JS, convertir a formato YYYY-MM-DD
            $fecha = date('Y-m-d', strtotime($data['prox_mantenimiento']));
            
            if (!RecursoValidation::validarFecha($fecha)) {
                $errores['prox_mantenimiento'] = 'La fecha no tiene el formato válido YYYY-MM-DD.';
            }
        }

        if (empty($data['id_tipo'])) {
              $errores['id_tipo'] = 'El tipo de recurso es obligatorio.';
        } elseif (!is_numeric($data['id_tipo']) || $data['id_tipo'] <= 0) {
              $errores['id_tipo'] = 'El tipo de recurso debe ser un número válido.';
        }

        return $errores;
    }


    private static function validarFecha($fecha) {
        $d = DateTime::createFromFormat('Y-m-d', $fecha);
           return $d && $d->format('Y-m-d') === $fecha;
    }
}

?>