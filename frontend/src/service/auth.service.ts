import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiURL = 'http://localhost/eventosc/backend/iniciosesion/usuario.php';

    constructor(private http: HttpClient) {}

    login(correo: string, contrasena: string): Observable<any> {
        return this.http.post(`${this.apiURL}?accion=login`, { correo, contrasena }, { withCredentials: true });
    }
    
    logout(): Observable<any> {
        return this.http.get(`${this.apiURL}?accion=logout`, { withCredentials: true });
    }

    checkSession(): Observable<any> {
        return this.http.get(`${this.apiURL}?accion=checksession`, { withCredentials: true });
    }
  
}
