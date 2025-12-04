<?php
class ServicioValidation {
    public static function validar($data) {
        $errores = [];

        if (empty($data['nombre'])) {
            $errores['nombre'] = 'El nombre del servicio es obligatorio.';
        } elseif (strlen($data['nombre']) > 100) {
            $errores['nombre'] = 'El nombre del servicio no puede superar 100 caracteres.';
        }

        return $errores;
    }
}

?>
