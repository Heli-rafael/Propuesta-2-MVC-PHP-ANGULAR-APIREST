import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.checkSession().pipe(
      map(res => {
        if (res.logged) {
          return true; // Permitir acceso
        } else {
          return this.router.parseUrl('/iniciosesion'); // Redirigir a login
        }
      }),
      catchError(err => {
        console.error('Error al verificar sesión', err);
        return of(this.router.parseUrl('/'));
      })
    );
  }
}
