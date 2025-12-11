export interface Pago {
  id?: number;
  id_tipo_pago: number;
  id_adelanto: number;
}

export interface TipoPago {
  id: number;
  nombre: string;
}

export interface Adelanto {
  id: number;
  valor: number;
}
