import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PrimeNG } from 'primeng/config';

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
  protected readonly title = signal('frontend');

  isAuthenticated: boolean = false;
  username: string | null = null;

  // Control del drawer
  visibleMenuDrawer: boolean = true;
  visibleProfileDrawer: boolean = false;

  private authStatusSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private primeng: PrimeNG,
  ) {
  }

  ngOnInit() {
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

  cerrarSesion(): void {
    this.visibleProfileDrawer = false;
    localStorage.clear();
    sessionStorage.clear();
    
    this.router.navigate(['/logindashboard']);
  }
  toggleDrawer(): void {
    this.visibleMenuDrawer = !this.visibleMenuDrawer;
  }

  activeRoute: string = '';
  currentLabel: string = '';
  
  menuItems = [
    { label: 'Panel General', icon: 'pi pi-th-large', route: '/' },
    { label: 'Reservas', icon: 'pi pi-calendar', route: '/reservas' },
    { label: 'Recursos', icon: 'pi pi-box', route: '/recursos' },
    { label: 'Proveedores', icon: 'pi pi-building', route: '/proveedores' },
    { label: 'Clientes', icon: 'pi pi-user', route: '/clientes' },
    { label: 'Pagos', icon: 'pi pi-credit-card', route: '/pagos' },
    { label: 'Notificaciones', icon: 'pi pi-bell', route: '/' },
    { label: 'Configuración', icon: 'pi pi-cog', route: '/' },
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
