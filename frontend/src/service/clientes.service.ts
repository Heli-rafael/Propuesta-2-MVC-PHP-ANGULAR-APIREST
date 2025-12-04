import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from './api.config';
import { Cliente } from '../model/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = `${ApiConfig.apiUrl}cliente.php`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}?accion=listar`);
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}?accion=obtener&id=${id}`);
  }

  crear(data: Cliente): Observable<any> {
    return this.http.post(`${this.apiUrl}?accion=crear`, data);
  }

  actualizar(id: number, data: Cliente): Observable<any> {
    return this.http.post(`${this.apiUrl}?accion=actualizar&id=${id}`, data);
  }

  eliminar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?accion=eliminar&id=${id}`);
  }
}
