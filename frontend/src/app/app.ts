import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrimeNG } from 'primeng/config';
import { AuthService } from '../service/auth.service';
import { AuthStateService } from '../service/auth-state.service';
interface TabButton {
  label: string;
  icon?: string;
  route: string; // ruta interna de Angular
}

interface Tab {
  title: string;
  active?: boolean;
  buttons?: TabButton[]; // botones específicos de cada tab
}

interface AccordionGroup {
  title: string;        // Título del acordeón padre
  active?: boolean;     // Estado expandido o no
  button?: ParentButton; // Botón principal del acordeón padre
  tabs: Tab[];          // Acordeones hijos dentro
}

interface ParentButton {
  label: string;
  icon?: string;
  route: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {

  isLogged: boolean = false;

  username: string | null = null;
  rol: string | null = null;
  correo: string | null = null;

  protected readonly title = signal('frontend');

  isAuthenticated: boolean = false;

  // Control del drawer
  visibleMenuDrawer: boolean = true;
  visibleProfileDrawer: boolean = false;

  private authStatusSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private primeng: PrimeNG,
    private authService: AuthService,
    private AuthStateService: AuthStateService
  ) {
  }

  ngOnInit() {
    // Verificar si ya hay sesión
    this.authStatusSubscription = this.AuthStateService.logged$.subscribe(logged => {
      this.isLogged = logged;

      if (logged) {
        // Actualiza los datos del perfil desde localStorage
        this.username = localStorage.getItem('user');
        this.rol = localStorage.getItem('rol');
        this.correo = localStorage.getItem('correo');

        // Redirigir si estamos en login
        if (this.router.url === '/iniciosesion') {
          this.router.navigate(['/panelgeneral']);
        }
      } else {
        this.username = null;
        this.rol = null;
        this.correo = null;
      }
    });

    this.primeng.setTranslation({
      firstDayOfWeek: 1,
      dayNames: [
        "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
      ],
      dayNamesShort: ["D", "L", "M", "X", "J", "V", "S"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      monthNamesShort: [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ],
      today: "Hoy",
      clear: "Limpiar"
    });

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;

      const found = this.menuItems.find(item => item.route === this.activeRoute);
      this.currentLabel = found ? found.label : '';
    });
  }

  

  ngOnDestroy() {
    // Limpieza de la suscripción cuando el componente se destruye
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  cerrarSesion() {
    this.authService.logout().subscribe({
      next: (res) => {
        this.isLogged = false;
        this.visibleProfileDrawer = false;
        localStorage.clear();
        this.router.navigate(['/iniciosesion']);
      },

    });
  }
  
  toggleDrawer(): void {
    this.visibleMenuDrawer = !this.visibleMenuDrawer;
  }

  activeRoute: string = '';
  currentLabel: string = '';
  
  menuItems = [
    { label: 'Panel General', icon: 'pi pi-th-large', route: '/panelgeneral' },
    { label: 'Reservas', icon: 'pi pi-calendar', route: '/reservas' },
    { label: 'Recursos', icon: 'pi pi-box', route: '/recursos' },
    { label: 'Proveedores', icon: 'pi pi-building', route: '/proveedores' },
    { label: 'Clientes', icon: 'pi pi-user', route: '/clientes' },
    { label: 'Pagos', icon: 'pi pi-credit-card', route: '/pagos' },
    { label: 'Usuarios', icon: 'pi pi-users', route: '/usuarios' },
  ];

  setActive(route: string) {
    this.activeRoute = route;

    const found = this.menuItems.find(item => item.route === route);
    this.currentLabel = found ? found.label : '';

    this.router.navigate([route]);
  }

  

  // Expandir acordeon padre
  toggleGroup(group: AccordionGroup) {
    group.active = !group.active;
  }

  // Expandir acordeon hijo
  toggleTab(tab: Tab) {
    tab.active = !tab.active;
  }

  // Navegación al hacer clic en un botón
  navigate(route: string) {
    this.router.navigate([route]);
  }

}
