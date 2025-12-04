import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoRecurso } from '../model/tipo-recurso.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class TipoRecursoService {
    
    private apiUrl = `${ApiConfig.apiUrl}tiporecurso.php`;

    constructor(private http: HttpClient) {}

    listar(): Observable<TipoRecurso[]> {
        return this.http.get<TipoRecurso[]>(`${this.apiUrl}?accion=listar`);
    }

    obtener(id: number): Observable<TipoRecurso> {
        return this.http.get<TipoRecurso>(`${this.apiUrl}?accion=obtener&id=${id}`);
    }

    crear(tipo: TipoRecurso): Observable<any> {
        return this.http.post(`${this.apiUrl}?accion=crear`, tipo);
    }

    actualizar(id: number, tipo: TipoRecurso): Observable<any> {
        return this.http.put(`${this.apiUrl}?accion=actualizar&id=${id}`, tipo);
    }

    eliminar(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}?accion=eliminar&id=${id}`);
    }
}
