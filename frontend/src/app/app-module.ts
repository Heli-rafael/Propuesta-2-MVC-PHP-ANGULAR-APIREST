import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <<-- IMPORTANTE

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// PrimeNG
import { HttpClientModule } from '@angular/common/http'; // <-- aquí
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import MyPreset from './mypreset';
import { MessageService } from 'primeng/api';

// Módulo principal de la aplicación
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { DrawerModule } from 'primeng/drawer';
import { Recursos } from './recursos/recursos';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select'; 
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { Proveedores } from './proveedores/proveedores';
import { Reservas } from './reservas/reservas';
import { Clientes } from './clientes/clientes';
import { Pagos } from './pagos/pagos';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { Iniciosesion } from './iniciosesion/iniciosesion';
import { Panelgeneral } from './panelgeneral/panelgeneral';
import { Usuarios } from './usuarios/usuarios';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    App,
    Recursos,
    Proveedores,
    Reservas,
    Clientes,
    Pagos,
    Iniciosesion,
    Panelgeneral,
    Usuarios
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // PrimeNG Modules
    InputTextModule,
    ButtonModule,
    TableModule,
    DrawerModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    SelectModule,
    InputTextModule,
    FloatLabelModule,
    MessageModule,
    DatePickerModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ChipModule,
    TagModule,
    ChartModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    }),
    MessageService,
  ],
  bootstrap: [App]
})
export class AppModule { }
