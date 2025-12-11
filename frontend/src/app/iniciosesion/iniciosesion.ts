import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { RolesService } from '../../service/roles.service';
import { AuthStateService } from '../../service/auth-state.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-iniciosesion',
  standalone: false,
  templateUrl: './iniciosesion.html',
  styleUrl: './iniciosesion.css',
})
export class Iniciosesion {

  correo: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(
    private authService: AuthService, 
    private rolesService: RolesService, 
    private authState: AuthStateService, 
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Opcional: si ya hay sesión activa, redirige automáticamente
    const user = localStorage.getItem('user');
    if (user) {
      this.authState.setLogged(true); 
      this.router.navigate(['/panelgeneral']);
    }
  }

  iniciarSesion(): void {
    this.authService.login(this.correo, this.contrasena).subscribe(
      (res) => {
        if (res.success) {
          localStorage.setItem('user', res.user);
          localStorage.setItem('correo', res.correo);

          // Obtener el rol
          this.rolesService.obtener(res.rol).subscribe(
            (rol) => {
              localStorage.setItem('rol', rol.nombre);
              this.authState.setLogged(true);
              this.router.navigate(['/panelgeneral']);
            },
            (err) => {
              console.error('Error al obtener el rol', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al obtener información del rol'
              });
            }
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Inicio de sesion',
            detail: res.message
          });
        }
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al iniciar sesión: ' + (err.message || 'Error desconocido')
        });
      }
    );
  }

  
}
