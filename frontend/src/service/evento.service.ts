import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../model/evento.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

    private apiUrl = `${ApiConfig.apiUrl}evento.php`;

    constructor(private http: HttpClient) {}

    listar(): Observable<Evento[]> {
        return this.http.get<Evento[]>(`${this.apiUrl}?accion=listar`);
    }

    obtener(id: number): Observable<Evento> {
        return this.http.get<Evento>(`${this.apiUrl}?accion=obtener&id=${id}`);
    }

    crear(evento: Evento): Observable<any> {
        return this.http.post(`${this.apiUrl}?accion=crear`, evento);
    }

    actualizar(id: number, evento: Evento): Observable<any> {
        return this.http.put(`${this.apiUrl}?accion=actualizar&id=${id}`, evento);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}?accion=eliminar&id=${id}`);
    }
}
