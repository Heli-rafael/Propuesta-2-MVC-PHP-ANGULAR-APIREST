import { Component } from '@angular/core';
import { ReservasService } from '../../service/reservas.service';
import { ClientesService } from '../../service/clientes.service';
import { PagosService } from '../../service/pagos.service';
import { UbicacionService } from '../../service/ubicacion.service';
import { EventoService } from '../../service/evento.service';
import { RecursosService } from '../../service/recursos.service';
import { ProveedorService } from '../../service/proveedor.service';
import { ReservasProveedoresService } from '../../service/reservasprovedores.service';
import { ReservasRecursosService } from '../../service/reservasrecursos.service';
import { MessageService } from 'primeng/api';

import { Cliente } from '../../model/cliente.model';
import { Pago } from '../../model/pago.model';
import { Ubicacion } from '../../model/ubicacion.model';
import { Evento } from '../../model/evento.model';
import { Reserva } from '../../model/reserva.model';
import { TipoPago } from '../../model/pago.model';
import { Adelanto } from '../../model/pago.model';


@Component({
  selector: 'app-reservas',
  standalone: false,
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas {

  // =======================
  // RESERVAS
  // =======================

  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  tiposPago: TipoPago[] = [];
  recursos: any[] = [];
  proveedores: any[] = [];

  totalPagadas: number = 0;
  totalReservas: number = 0;
  totalPorPagar: number = 0;
  totalConAdelanto: number = 0;
  totalCanceladas: number = 0;

  busqueda: string = "";
  filtroEstado: string | null = null;

 estados: { label: string, value: 'Por Pagar' | 'Con Adelanto' | 'Pagada'| 'Cancelada' }[] = [
  { label: 'Por Pagar', value: 'Por Pagar' },
  { label: 'Con Adelanto', value: 'Con Adelanto' },
  { label: 'Pagada', value: 'Pagada' },
  { label: 'Cancelada', value: 'Cancelada' },
];

  // Modales reservas
  modalVisible: boolean = false;
  modalEliminarVisible: boolean = false;
  modalTitulo: string = "";
  reservaModal: Reserva = this.getEmptyReserva();

  constructor(
    private reservasService: ReservasService,
    private clientesService: ClientesService,
    private pagosService: PagosService,
    private ubicacionService: UbicacionService,
    private eventoService: EventoService,
    private recursosService: RecursosService,
    private proveedoresService: ProveedorService,
    private reservasRecursosService: ReservasRecursosService,
    private reservasProveedoresService: ReservasProveedoresService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.listarClientes();
    this.listarPagos();
    this.listarUbicaciones();
    this.listarEventos();
    this.listarTiposPago();
    this.listarAdelantos();
    this.listarRecursos();
    this.listarProveedores()
    this.listar();

  }

  listarTiposPago() {
    this.pagosService.listarTiposPago().subscribe(data => this.tiposPago = data);
  }

  listarRecursos() {
    this.recursosService.listar().subscribe(data => this.recursos = data);
  }

  listarProveedores() {
    this.proveedoresService.listarProveedores().subscribe(data => this.proveedores = data);
  }


  // --- Cargar ---
  listar() {
    this.reservasService.listar().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = data;
        this.calcularResumen();
      },
      error: (err) => console.error(err)
    });
  }

  // --- Resumen ---
  calcularResumen() {
    this.totalReservas = this.reservas.length;
    this.totalPagadas = this.reservas.filter(r => r.estado === 'Pagada').length;
    this.totalPorPagar = this.reservas.filter(r => r.estado === 'Por Pagar').length;
    this.totalConAdelanto = this.reservas.filter(r => r.estado === 'Con Adelanto').length;
    this.totalCanceladas = this.reservas.filter(r => r.estado === 'Cancelada').length;
  }

  // --- Filtros ---
  filtrar() {
    this.reservasFiltradas = this.reservas.filter(r => {
      const coincideBusqueda =
        this.busqueda.trim() === "" ||
        r.id?.toString().includes(this.busqueda);

      const fechaTexto =
        typeof r.fecha === 'string'
          ? r.fecha
          : r.fecha.toISOString().slice(0, 10);

      const coincideEstado =
        !this.filtroEstado || r.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado && fechaTexto;
    });
  }

  // Devuelve el nombre del cliente por su id
  getNombreCliente(id: number | undefined): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'N/A';
  }

  // Devuelve el nombre del tipo de pago por su id
  getNombrePago(idPago: number | undefined): string {
    if (!idPago) return 'N/A';

    // Buscar el pago correspondiente
    const pago = this.pagos.find(p => p.id === idPago);
    if (!pago) return 'N/A';

    // Buscar el tipo de pago correspondiente
    const tipo = this.tiposPago.find(t => t.id === pago.id_tipo_pago);
    return tipo ? tipo.nombre : 'N/A';
  }
  
  // Devuelve el valor del adelanto de una reserva por su id de pago
  getValorAdelanto(idPago: number | undefined): number {
    if (!idPago) return 0;

    const pago: Pago | undefined = this.pagos.find(p => p.id === idPago);
    if (!pago || !pago.id_adelanto) return 0;

    const adelanto: Adelanto | undefined = this.adelantos.find(a => a.id === pago.id_adelanto);
    return adelanto ? adelanto.valor : 0;
  }

  getAdelantoEnSoles(r: Reserva): number {
    const porcentaje = this.getValorAdelanto(r.id_pagos); // devuelve 10, 20, etc.
    return r.total * (porcentaje / 100);
  }

  // Devuelve el saldo restante
  getSaldo(r: Reserva): number {
    return r.total - this.getAdelantoEnSoles(r);
  }

  // Devuelve el nombre del evento por su id
  getNombreEvento(id: number | undefined): string {
    const evento = this.eventos.find(e => e.id === id);
    return evento ? evento.nombre : 'N/A';
  }

  // Devuelve el nombre de la ubicación por su id
  getNombreUbicacion(id: number | undefined): string {
    const ubicacion = this.ubicaciones.find(u => u.id === id);
    return ubicacion ? ubicacion.nombre : 'N/A';
  }

  // --- Modales ---
  abrirModalAgregar() {
    this.modalTitulo = "Nueva Reserva";
    this.reservaModal = this.getEmptyReserva();

    // Cargar recursos desde el servicio
    this.recursosService.listar().subscribe({
      next: (todosRecursos: any[]) => {
        // Filtrar los recursos que no están disponibles o en uso
        this.recursos = todosRecursos.map(r => {
          return {
            ...r,
            oculto: r.estado !== 'Disponible'
          };
        });
      },
      error: (err) => console.error('Error cargando recursos', err)
    });
    this.modalVisible = true;
  }

  abrirModalEditar(reserva: Reserva) {
    this.modalTitulo = "Editar Reserva";

    // Inicializar reservaModal
    this.reservaModal = { ...reserva, recursos: [], proveedores: [] };
    this.modalVisible = true;

    // Convertir fecha
    if (this.reservaModal.fecha) {
      this.reservaModal.fecha = new Date(reserva.fecha + 'T00:00:00');
    }

    // Cargar pago asociado
    if (reserva.id_pagos) {
      this.pagosService.obtener(reserva.id_pagos).subscribe({
        next: (pago) => {
          this.reservaModal.id_tipo_pago = pago.id_tipo_pago;
          this.reservaModal.id_adelanto = pago.id_adelanto;
        }
      });
    }

    // Cargar recursos asociados
    this.reservasRecursosService.obtenerPorReserva(reserva.id!).subscribe({
      next: (res) => {
        const recursosAsociados = res.map(r => r.id_recursos);

        // Traer todos los recursos desde el servicio
        this.recursosService.listar().subscribe({
          next: (todosRecursos) => {
            // Filtrar recursos disponibles, pero incluir los que ya están en la reserva
            this.recursos = todosRecursos.map((r: any) => {
              return {
                ...r,
                oculto: (r.estado !== 'Disponible' && !recursosAsociados.includes(r.id))
              };
            });

            // Asignar recursos de la reserva al ngModel
            this.reservaModal.recursos = recursosAsociados;
          }
        });
      }
    });

    // Cargar proveedores asociados
    this.reservasProveedoresService.obtenerPorReserva(reserva.id!).subscribe({
      next: (res) => {
        this.reservaModal.proveedores = res.map(p => p.id_proveedores);
      }
    });
  }

  get recursosDisponibles() {
    if (!this.recursos) return [];
    return this.recursos.filter(r => !r.oculto);
  }

  cerrarModal() { this.modalVisible = false; }

  abrirModalEliminar(reserva: Reserva) {
    this.reservaModal = { ...reserva };
    this.modalEliminarVisible = true;
  }

  cerrarModalEliminar() { this.modalEliminarVisible = false; }

  guardarReserva() {
    if (typeof this.reservaModal.fecha === 'object') {
      this.reservaModal.fecha = new Date(this.reservaModal.fecha)
        .toISOString()
        .slice(0, 10);
    }

    // Objeto del pago a crear o actualizar
    const pago: Pago = {
      id_tipo_pago: this.reservaModal.id_tipo_pago,
      id_adelanto: this.reservaModal.id_adelanto
    };

    // Si es reserva existente, actualizar el pago
    if (this.reservaModal.id && this.reservaModal.id_pagos) {
      this.pagosService.actualizar(this.reservaModal.id_pagos, pago).subscribe({
        next: () => this.crearOActualizarReserva(),
        error: (err) => this.mostrarErrorPago(err)
      });
    } else {
      // Si es reserva nueva, crear el pago
      this.pagosService.crear(pago).subscribe({
        next: (pagoCreado) => {
          this.reservaModal.id_pagos = pagoCreado.id;
          this.crearOActualizarReserva();
        },
        error: (err) => this.mostrarErrorPago(err)
      });
    }
  }

  // Método auxiliar para crear o actualizar la reserva
  crearOActualizarReserva() {
    if (this.reservaModal.id) {
      this.reservasService.actualizar(this.reservaModal.id, this.reservaModal)
        .subscribe(res => this.procesarRespuestaReserva(res));
    } else {
      this.reservasService.crear(this.reservaModal)
        .subscribe(res => this.procesarRespuestaReserva(res));
    }
  }

  // Mostrar error de pago
  mostrarErrorPago(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear/actualizar el pago: ' + (err.message || 'Error desconocido')
    });
  }

  // Método auxiliar para procesar la respuesta de la reserva
  procesarRespuestaReserva(res: any) {
    if (res.errores) return this.mostrarErroresBackend(res.errores);

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: this.reservaModal.id ? 'Reserva actualizada' : 'Reserva creada'
    });

    this.listar();
    this.cerrarModal();
  }

  mostrarErroresBackend(errores: any) {
    Object.keys(errores).forEach(key => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error en ' + key,
        detail: errores[key]
      });
    });
  }

  eliminarReserva() {
    if (!this.reservaModal.id) return;

    this.reservasService.eliminar(this.reservaModal.id)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Reserva eliminada'
        });
        this.listar();
        this.cerrarModalEliminar();
      });
  }

  getEmptyReserva(): Reserva {
    return {
      fecha: '',
      numero_asistentes: 0,
      total: 0,
      estado: 'Por Pagar',
      id_cliente: 0,
      id_pagos: 0,
      id_evento: 0,
      id_ubicacion: 0,
      id_tipo_pago: 0,
      id_adelanto: 0,
      recursos: [],
      proveedores: []
    };
  }

  clientes: Cliente[] = [];
  pagos: Pago[] = [];

  listarClientes() {
    this.clientesService.listar().subscribe(data => this.clientes = data);
  }

  listarPagos() {
    this.pagosService.listar().subscribe(data => this.pagos = data);
  }


  // =======================
  // UBICACIÓN
  // =======================

  ubicaciones: Ubicacion[] = [];
  ubicacionesFiltradas: Ubicacion[] = [];
  busquedaUbicacion: string = '';

  // Modales ubicación
  modalUbicaciones: boolean = false;
  modalVisibleUbicacion: boolean = false;
  modalEliminarVisibleUbicacion: boolean = false;

  modalTituloUbicacion: string = "Agregar Ubicación";
  ubicacionModal: Ubicacion = { nombre: '' };
  ubicacionSeleccionadaObj: Ubicacion | null = null;

  listarUbicaciones() {
    this.ubicacionService.listar().subscribe(data => {
      this.ubicaciones = data;
      this.filtrarUbicaciones();
    });
  }

  filtrarUbicaciones() {
    this.ubicacionesFiltradas = this.ubicaciones.filter(u =>
      !this.busquedaUbicacion ||
      u.nombre.toLowerCase().includes(this.busquedaUbicacion.toLowerCase())
    );
  }

  abrirModalUbicacion() { this.modalUbicaciones = true; }

  abrirModalAgregarUbicacion() {
    this.modalTituloUbicacion = "Agregar Ubicación";
    this.ubicacionModal = { nombre: '' };
    this.modalVisibleUbicacion = true;
  }

  abrirModalEditarUbicacion(ubicacion: Ubicacion) {
    this.modalTituloUbicacion = "Editar Ubicación";
    this.ubicacionModal = { ...ubicacion };
    this.ubicacionSeleccionadaObj = ubicacion;
    this.modalVisibleUbicacion = true;
  }

  cerrarModalUbicacion() { this.modalVisibleUbicacion = false; }

  abrirModalEliminarUbicacion(ubicacion: Ubicacion) {
    this.ubicacionSeleccionadaObj = ubicacion;
    this.modalEliminarVisibleUbicacion = true;
  }

  cerrarModalEliminarUbicacion() { this.modalEliminarVisibleUbicacion = false; }

  guardarUbicacion() {
    if (!this.ubicacionModal.nombre) return;

    if (this.ubicacionModal.id) {
      this.ubicacionService.actualizar(this.ubicacionModal.id, this.ubicacionModal).subscribe({
        next: () => {
          this.listarUbicaciones();
          this.modalVisibleUbicacion = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ubicación actualizada' });
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado' })
      });

    } else {
      this.ubicacionService.crear(this.ubicacionModal).subscribe({
        next: () => {
          this.listarUbicaciones();
          this.modalVisibleUbicacion = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ubicación creada' });
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado' })
      });
    }
  }

  eliminarUbicacion() {
    if (!this.ubicacionSeleccionadaObj?.id) return;

    this.ubicacionService.eliminar(this.ubicacionSeleccionadaObj.id).subscribe(() => {
      this.modalEliminarVisibleUbicacion = false;
      this.listarUbicaciones();
    });
  }


// ============================
// EVENTO
// ============================

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  busquedaEvento: string = '';

  modalEventos: boolean = false;
  modalVisibleEvento: boolean = false;
  modalEliminarVisibleEvento: boolean = false;

  modalTituloEvento: string = "Agregar Evento";
  eventoModal: Evento = { nombre: '', estado: 'Disponible' };
  eventoSeleccionadoObj: Evento | null = null;

  estadosEvento = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'No Disponible', value: 'No Disponible' }
  ];

  listarEventos() {
    this.eventoService.listar().subscribe(data => {
      this.eventos = data;
      this.filtrarEventos();
    });
  }

  filtrarEventos() {
    this.eventosFiltrados = this.eventos.filter(e =>
      !this.busquedaEvento ||
      e.nombre.toLowerCase().includes(this.busquedaEvento.toLowerCase())
    );
  }

  abrirModalEvento() { this.modalEventos = true; }

  abrirModalAgregarEvento() {
    this.modalTituloEvento = "Agregar Evento";
    this.eventoModal = { nombre: '', estado: 'Disponible' };
    this.modalVisibleEvento = true;
  }

  abrirModalEditarEvento(evento: Evento) {
    this.modalTituloEvento = "Editar Evento";
    this.eventoModal = { ...evento };
    this.eventoSeleccionadoObj = evento;
    this.modalVisibleEvento = true;
  }

  cerrarModalEvento() { this.modalVisibleEvento = false; }

  abrirModalEliminarEvento(evento: Evento) {
    this.eventoSeleccionadoObj = evento;
    this.modalEliminarVisibleEvento = true;
  }

  cerrarModalEliminarEvento() { this.modalEliminarVisibleEvento = false; }

  guardarEvento() {
    if (!this.eventoModal.nombre) return;

    if (this.eventoModal.id) {
      this.eventoService.actualizar(this.eventoModal.id, this.eventoModal).subscribe({
        next: () => {
          this.listarEventos();
          this.modalVisibleEvento = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento actualizado' });
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado' })
      });

    } else {
      this.eventoService.crear(this.eventoModal).subscribe({
        next: () => {
          this.listarEventos();
          this.modalVisibleEvento = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento creado' });
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error inesperado' })
      });
    }
  }

  eliminarEvento() {
    if (!this.eventoSeleccionadoObj?.id) return;

    this.eventoService.eliminar(this.eventoSeleccionadoObj.id).subscribe(() => {
      this.modalEliminarVisibleEvento = false;
      this.listarEventos();
    });
  }

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
