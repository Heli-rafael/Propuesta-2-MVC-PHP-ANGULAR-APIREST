import { Component } from '@angular/core';
import { Cliente } from '../../model/cliente.model';
import { ClientesService } from '../../service/clientes.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  // filtros
  busqueda: string = "";
  filtroLetra: string | null = null;

  // Modal
  modalVisible = false;
  modalEliminarVisible = false;
  modalTitulo = "Agregar Cliente";

  clienteModal: Cliente = {
    nombre: "",
    apellidos: "",
    telefono: "",
    dni: "",
    correo: ""
  };

  clienteSeleccionado: Cliente | null = null;

  constructor(private clientesService: ClientesService, private messageService: MessageService) {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.listar().subscribe(res => {
      this.clientes = res || [];
      this.clientesFiltrados = [...this.clientes];
    });
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();

    this.clientesFiltrados = this.clientes.filter(c => {
      const coincideBusqueda = 
        c.nombre.toLowerCase().includes(texto) ||
        c.apellidos.toLowerCase().includes(texto) ||
        c.dni.includes(texto);
        c.correo.toLowerCase().includes(texto); // Incluido correo en la búsqueda


      const coincideLetra =
        !this.filtroLetra ||
        c.apellidos.charAt(0).toUpperCase() === this.filtroLetra;

      return coincideBusqueda && coincideLetra;
    });
  }

  // Abrir modales
  abrirModalAgregar() {
    this.modalTitulo = "Agregar Cliente";
    this.clienteModal = { nombre: "", apellidos: "", telefono: "", dni: "", correo: "" };
    this.modalVisible = true;
  }

  abrirModalEditar(c: Cliente) {
    this.modalTitulo = "Editar Cliente";
    this.clienteModal = { ...c };
    this.clienteSeleccionado = c;
    this.modalVisible = true;
  }

  abrirModalEliminar(c: Cliente) {
    this.clienteSeleccionado = c;
    this.modalEliminarVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
  }

  guardar() {
    if (!this.clienteModal.nombre || !this.clienteModal.apellidos) return;

    if (this.clienteModal.id) {
      // actualizar
      this.clientesService.actualizar(this.clienteModal.id, this.clienteModal).subscribe({
        next: () => {
          this.cargarClientes();
          this.modalVisible = false;
          // Opcional: mensaje de éxito
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente' });
        },
        error: (err) => {
          console.error(err); // Para debug en consola

          // Extraer errores del backend
          const detalles = err?.error?.detalles;
          if (detalles && detalles.length) {
            detalles.forEach((msg: string) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado' });
          }
        }
      });
    } else {
      this.clientesService.crear(this.clienteModal).subscribe({
        next: () => {
          this.cargarClientes();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error(err); // para debug en consola

          // Extraer errores del backend
          const detalles = err?.error?.detalles;
          if (detalles && detalles.length) {
            detalles.forEach((msg: string) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado' });
          }
        }
      });
    }
  }

  eliminar() {
    if (!this.clienteSeleccionado) return;

    this.clientesService.eliminar(this.clienteSeleccionado.id!).subscribe(() => {
      this.cargarClientes();
      this.modalEliminarVisible = false;
    });
  }
}
