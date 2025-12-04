// reserva.model.ts
export interface Reserva {
  id?: number;
  fecha: string | Date;
  numero_asistentes: number;
  total: number;
  estado?: 'Cancelada' | 'Con Adelanto' | 'Por Pagar' | 'Pagada';
  id_cliente: number;
  id_pagos: number;
  id_evento: number;
  id_ubicacion: number;

  // Campos relacionados
  id_tipo_pago: number;
  id_adelanto: number;

  recursos?: number[];
  proveedores?: number[];
}
