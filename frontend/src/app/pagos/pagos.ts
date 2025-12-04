import { Component } from '@angular/core';
import { Pago } from '../../model/pago.model';
import { PagosService } from '../../service/pagos.service';
import { TipoPago } from '../../model/pago.model';
import { Adelanto } from '../../model/pago.model';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pagos',
  standalone: false,
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos {

  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  busqueda: string = '';
  filtroTipoPago: number | null = null;

  // Modales
  modalVisible: boolean = false;
  modalEliminarVisible: boolean = false;
  pagoModal: Pago = {} as Pago;
  modalTitulo: string = 'Agregar Pago';

  constructor(private pagosService: PagosService, private messageService: MessageService) {}

  ngOnInit() {
    this.listarPagos();
    // Tipo pagos
    this.listarTipoPagos();

    // Adelantos
    this.listarAdelantos();
  }
  
  listarPagos() {
    this.pagosService.listar().subscribe(data => {
      this.pagos = data;
      this.filtrar();
    });
  }

  filtrar() {
    this.pagosFiltrados = this.pagos.filter(p => {
      const matchBusqueda = !this.busqueda || 
        (p.tipo_pago?.toLowerCase().includes(this.busqueda.toLowerCase()) )

      const matchTipo = !this.filtroTipoPago || p.id_tipo_pago === this.filtroTipoPago;

      return matchBusqueda && matchTipo;
    });
  }

  abrirModalAgregar() {
    this.pagoModal = {} as Pago;
    this.modalTitulo = 'Agregar Pago';
    this.modalVisible = true;
  }

  abrirModalEditar(pago: Pago) {
    this.pagoModal = { ...pago };
    this.modalTitulo = 'Editar Pago';
    this.modalVisible = true;
  }

  guardarPago() {
    if (this.pagoModal.id) {
      this.pagosService.actualizar(this.pagoModal.id, this.pagoModal).subscribe(() => {
        this.listarPagos();
        this.modalVisible = false;
      });
    } else {
      this.pagosService.crear(this.pagoModal).subscribe(() => {
        this.listarPagos();
        this.modalVisible = false;
      });
    }
  }

  abrirModalEliminar(pago: Pago) {
    this.pagoModal = { ...pago };
    this.modalEliminarVisible = true;
  }

  eliminarPago() {
    if (this.pagoModal.id) {
      this.pagosService.eliminar(this.pagoModal.id).subscribe(() => {
        this.listarPagos();
        this.modalEliminarVisible = false;
      });
    }
  }

  cerrarModal() { this.modalVisible = false; }
  cerrarModalEliminar() { this.modalEliminarVisible = false; }

  //================================
  // Tipo pago
  //================================

  tipos: TipoPago[] = [];
  tiposFiltrados: TipoPago[] = [];
  busquedaTipoPago: string = '';

  // Modales
  modalTipoPago: boolean= false;
  modalVisibleTipoPago: boolean = false;
  modalEliminarVisibleTipoPago: boolean = false;
  tipoModal: TipoPago = {} as TipoPago;
  tipoSeleccionado: TipoPago = {} as TipoPago;
  modalTituloTipoPago: string = 'Agregar Tipo de Pago';

  listarTipoPagos() {
    this.pagosService.listarTiposPago().subscribe(data => {
      this.tipos = data;
      this.filtrarTipos();
    });
  }

  filtrarTipos() {
    this.tiposFiltrados = this.tipos.filter(t =>
      !this.busquedaTipoPago || t.nombre.toLowerCase().includes(this.busquedaTipoPago.toLowerCase())
    );
  }
  abrirModalTipoPago(){
    this.modalTipoPago = true;
  }

  abrirModalAgregarTipoPago() {
    this.tipoModal = {} as TipoPago;
    this.modalTitulo = 'Agregar Tipo de Pago';
    this.modalVisibleTipoPago = true;
  }

  abrirModalEditarTipoPago(tipo: TipoPago) {
    this.tipoModal = { ...tipo };
    this.modalTitulo = 'Editar Tipo de Pago';
    this.modalVisibleTipoPago = true;
  }

  guardarTipoPago() {
    // Validación básica: por ejemplo, que tenga un nombre
    if (!this.tipoModal.nombre) return;

    if (this.tipoModal.id) {
      // actualizar
      this.pagosService.actualizarTipoPago(this.tipoModal.id, this.tipoModal).subscribe({
        next: () => {
          this.listarTipoPagos();
          this.modalVisibleTipoPago = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de pago actualizado correctamente' });
        },
        error: (err) => {
          console.error(err); // para debug en consola

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
      // crear
      this.pagosService.crearTipoPago(this.tipoModal).subscribe({
        next: () => {
          this.listarTipoPagos();
          this.modalVisibleTipoPago = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de pago creado correctamente' });
        },
        error: (err) => {
          console.error(err); // para debug en consola

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

  abrirModalEliminarTipoPago(tipo: TipoPago) {
    this.tipoSeleccionado = { ...tipo };
    this.modalEliminarVisibleTipoPago = true;
  }

  eliminarTipoPago() {
    if (this.tipoSeleccionado.id) {
      this.pagosService.eliminarTipoPago(this.tipoSeleccionado.id).subscribe(() => {
        this.listarTipoPagos();
        this.modalEliminarVisibleTipoPago = false;
      });
    }
  }

  cerrarModalTipoPago() { this.modalVisibleTipoPago = false; }
  cerrarModalEliminarTipoPago() { this.modalEliminarVisibleTipoPago = false; }

  //================================
  // Adelanto
  //================================

  adelantos: Adelanto[] = [];
  adelantosFiltrados: Adelanto[] = [];
  busquedaAdelanto: string = '';

  // Modales
  modalAdelanto: boolean= false;
  modalVisibleAdelanto: boolean = false;
  modalEliminarVisibleAdelanto: boolean = false;
  adelantoModal: Adelanto = {} as Adelanto;
  adelantoSeleccionado: Adelanto = {} as Adelanto;
  modalTituloAdelanto: string = 'Agregar Adelanto';

  listarAdelantos() {
    this.pagosService.listarAdelantos().subscribe(data => {
      this.adelantos = data;
      this.filtrarAdelantos();
    });
  }

  filtrarAdelantos() {
    this.adelantosFiltrados = this.adelantos.filter(a =>
      !this.busquedaAdelanto || a.valor.toString().includes(this.busquedaAdelanto)
    );
  }

  abrirModalAdelanto() {
    this.modalAdelanto = true;
  }

  abrirModalAgregarAdelanto() {
    this.adelantoModal = {} as Adelanto;
    this.modalTituloAdelanto = 'Agregar Adelanto';
    this.modalVisibleAdelanto = true;
  }

  abrirModalEditarAdelanto(adelanto: Adelanto) {
    this.adelantoModal = { ...adelanto };
    this.modalTituloAdelanto = 'Editar Adelanto';
    this.modalVisibleAdelanto = true;
  }

  guardarAdelanto() {
    if (this.adelantoModal.id) {
      // Actualizar
      this.pagosService.actualizarAdelanto(this.adelantoModal.id, this.adelantoModal).subscribe({
        next: () => {
          this.listarAdelantos();
          this.modalVisibleAdelanto = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Adelanto actualizado correctamente' });
        },
        error: (err) => {
          console.error(err); // Para depuración

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
      // Crear
      this.pagosService.crearAdelanto(this.adelantoModal).subscribe({
        next: () => {
          this.listarAdelantos();
          this.modalVisibleAdelanto = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Adelanto creado correctamente' });
        },
        error: (err) => {
          console.error(err); // Para depuración

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

  abrirModalEliminarAdelanto(adelanto: Adelanto) {
    this.adelantoSeleccionado = { ...adelanto };
    this.modalEliminarVisibleAdelanto = true;
  }

  eliminarAdelanto() {
    if (this.adelantoSeleccionado.id) {
      this.pagosService.eliminarAdelanto(this.adelantoSeleccionado.id).subscribe(() => {
        this.listarAdelantos();
        this.modalEliminarVisibleAdelanto = false;
      });
    }
  }

  cerrarModalAdelanto() { this.modalVisibleAdelanto = false; }
  cerrarModalEliminarAdelanto() { this.modalEliminarVisibleAdelanto = false; }

}
