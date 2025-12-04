import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaProveedor } from '../model/reservaproveedor.model';
import { ApiConfig } from './api.config';

@Injectable({ providedIn: 'root' })
export class ReservasProveedoresService {
    private apiUrl = `${ApiConfig.apiUrl}reservasproveedor.php`;

    constructor(private http: HttpClient) {}

    listar(): Observable<ReservaProveedor[]> {
        return this.http.get<ReservaProveedor[]>(`${this.apiUrl}?accion=listar`);
    }

    obtenerPorReserva(id_reservas: number): Observable<ReservaProveedor[]> {
    return this.http.get<ReservaProveedor[]>(`${this.apiUrl}?accion=obtenerPorReserva&id_reservas=${id_reservas}`);
}
    
}