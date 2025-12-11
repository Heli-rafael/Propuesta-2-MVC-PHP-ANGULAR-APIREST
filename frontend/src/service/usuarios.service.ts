import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/usuario.model';
import { Observable } from 'rxjs';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${ApiConfig.apiUrl}usuario.php`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?accion=listar`);
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}?accion=obtener&id=${id}`);
  }

  crear(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}?accion=crear`, usuario);
  }

  actualizar(id: number, usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}?accion=actualizar&id=${id}`, usuario);
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}?accion=eliminar&id=${id}`, {});
  }
}
