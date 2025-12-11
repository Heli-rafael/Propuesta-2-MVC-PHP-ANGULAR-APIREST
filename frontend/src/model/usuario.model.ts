export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  estado?: string;
  rol?: string;
  id_rol?: number;
  fecha_registro?: string;
}
