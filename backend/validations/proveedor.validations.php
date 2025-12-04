<?php

class ProveedorValidation {

    public static function validar($data) {
        $errores = [];
     


        if (empty($data['nombre_empresa'])) {
            $errores['nombre_empresa'] = 'El nombre de la empresa  obligatorio.';
        } elseif (strlen($data['nombre_empresa']) < 3) {
            $errores['nombre_empresa'] = 'El nombre de la empresa debe tener al menos 3 caracteres.';
        }



        if (empty($data['nombre_responsable'])) {
            $errores['nombre_responsable'] = 'El nombre del responsable es obligatorio.';
        }



        if (empty($data['telefono'])) {
           $errores['telefono'] = 'El teléfono es obligatorio.';
        } elseif (!preg_match('/^[0-9]{9}$/', $data['telefono'])) {
            $errores['telefono'] = 'El teléfono debe tener exactamente 9 dígitos.';
      
        }


        if (empty($data['email'])) {
            $errores['email'] = 'El correo es obligatorio.';
         } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errores['email'] = 'El correo no tiene un formato válido.';
        }




        if (empty($data['direccion'])) {
        $errores['direccion'] = 'La dirección es obligatoria.';
        }

        return $errores;
    }

}

?>