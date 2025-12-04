<?php 

    class UbicacionValidator{

        private $data;
        private $errores = [];

        public function __construct(array $data){$this->data = $data;}

        
        public function validarUbicacionId($id){
            $this->errores = [];

            if(empty($id)){
                $errores[] = 'El ID es obligatorio.';
            } else if (!is_numeric($id) || $id <= 0){
                $errores[] = 'El ID debe ser un número entero positivo.';
            }
            return $errores;
        }

        public function validateDatos($data){
            $this->errores = [];
            $nombre = $this->data['nombre'] ?? '';

            if (empty(trim($nombre))){
                $this->errores['nombre'] = 'El nombre de la ubicación es obligatoria.';
            } elseif (strlen($nombre) < 3){
                $this->errores['nombre'] = 'El nombre de la ubicación debe tener más de 3 caracteres.';
            } elseif (strlen($nombre) > 100){
                $this->errores['nombre'] = 'El nombre de la ubicación no debe exceder los 100 caracteres.';
            }

            // Retorna true si no hay errores, false si los hay
            return empty($this->errores);
        }

        public function getErrors()
        {
            return $this->errores;
        }

        public static function validateId($id)
        {
            $errores = [];
            if (empty($id)) {
                $errores['id'] = 'El ID de la ubicación es obligatorio.';
            } else if (!is_numeric($id) || $id <= 0) {
                $errores['id'] = 'El ID debe ser un número entero positivo.';
            }
            return $errores;
        }

    }

?>