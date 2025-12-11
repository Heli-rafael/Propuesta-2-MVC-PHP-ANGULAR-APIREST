import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Recursos } from './recursos/recursos';
import { Proveedores } from './proveedores/proveedores';
import { Reservas } from './reservas/reservas';
import { Clientes } from './clientes/clientes';
import { Pagos } from './pagos/pagos';
import { AuthGuard } from '../service/auth.guard';
import { Iniciosesion } from './iniciosesion/iniciosesion';
import { Panelgeneral } from './panelgeneral/panelgeneral';
import { Usuarios } from './usuarios/usuarios';

const routes: Routes = [
  { path: '', component: Iniciosesion },
  { path: 'iniciosesion', component: Iniciosesion },
  { path: 'panelgeneral', component: Panelgeneral, canActivate: [AuthGuard]},
  { path: 'recursos', component: Recursos, canActivate: [AuthGuard] },
  { path: 'proveedores', component: Proveedores, canActivate: [AuthGuard] },
  { path: 'reservas', component: Reservas, canActivate: [AuthGuard] },
  { path: 'clientes', component: Clientes, canActivate: [AuthGuard] },
  { path: 'usuarios', component: Usuarios, canActivate: [AuthGuard] },
  { path: 'pagos', component: Pagos, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
