import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../model/ubicacion.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

    private apiUrl = `${ApiConfig.apiUrl}ubicacion.php`;

    constructor(private http: HttpClient) {}

    listar(): Observable<Ubicacion[]> {
        return this.http.get<Ubicacion[]>(`${this.apiUrl}?accion=listar`);
    }

    obtener(id: number): Observable<Ubicacion> {
        return this.http.get<Ubicacion>(`${this.apiUrl}?accion=obtener&id=${id}`);
    }

    crear(ubicacion: Ubicacion): Observable<any> {
        return this.http.post(`${this.apiUrl}?accion=crear`, ubicacion);
    }

    actualizar(id: number, ubicacion: Ubicacion): Observable<any> {
        return this.http.put(`${this.apiUrl}?accion=actualizar&id=${id}`, ubicacion);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}?accion=eliminar&id=${id}`);
    }
}
