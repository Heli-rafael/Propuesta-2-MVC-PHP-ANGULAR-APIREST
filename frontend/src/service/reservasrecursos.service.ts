import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaRecurso } from '../model/reservarecurso.model';
import { ApiConfig } from './api.config';

@Injectable({ providedIn: 'root' })
export class ReservasRecursosService {
  private apiUrl = `${ApiConfig.apiUrl}reservasrecurso.php`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ReservaRecurso[]> {
    return this.http.get<ReservaRecurso[]>(`${this.apiUrl}?accion=listar`);
  }

  obtenerPorReserva(id_reservas: number): Observable<ReservaRecurso[]> {
  return this.http.get<ReservaRecurso[]>(
    `${this.apiUrl}?accion=obtenerPorReserva&id_reservas=${id_reservas}`
  );
}
}