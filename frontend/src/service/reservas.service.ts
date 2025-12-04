import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../model/reserva.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

    private apiUrl = `${ApiConfig.apiUrl}reservas.php`;

    constructor(private http: HttpClient) {}

    listar(): Observable<Reserva[]> {
      return this.http.get<Reserva[]>(`${this.apiUrl}?accion=listar`);
    }
  
    obtener(id: number): Observable<Reserva> {
      return this.http.get<Reserva>(`${this.apiUrl}?accion=obtener&id=${id}`);
    }
  
    crear(reserva: Reserva): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}?accion=crear`, reserva);
    }
  
    actualizar(id: number, reserva: Reserva): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}?accion=actualizar&id=${id}`, reserva);
    }
  
    eliminar(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}?accion=eliminar&id=${id}`);
    }


    listarEventos(): Observable<Reserva[]> {
      return this.http.get<Reserva[]>(`${this.apiUrl}?accion=listar`);
    }

    listarUbicaciones(): Observable<Reserva[]> {
      return this.http.get<Reserva[]>(`${this.apiUrl}?accion=listar`);
    }

    asignarUsuario(id_reserva: number, id_usuario: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}?accion=asignar_usuario`, { id_reserva, id_usuario });
    }
}
