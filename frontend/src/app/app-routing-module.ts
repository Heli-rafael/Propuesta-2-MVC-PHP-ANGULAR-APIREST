import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from './roles/roles';
import { Recursos } from './recursos/recursos';
import { Proveedores } from './proveedores/proveedores';
import { Reservas } from './reservas/reservas';
import { Clientes } from './clientes/clientes';
import { Pagos } from './pagos/pagos';

const routes: Routes = [
  { path: 'roles', component: Roles },
  { path: 'recursos', component: Recursos },
  { path: 'proveedores', component: Proveedores },
  { path: 'reservas', component: Reservas },
  { path: 'clientes', component: Clientes },
  { path: 'pagos', component: Pagos },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
