import { Component } from '@angular/core';
import { Pago } from '../../model/pago.model';
import { PagosService } from '../../service/pagos.service';
import { TipoPago } from '../../model/pago.model';
import { Adelanto } from '../../model/pago.model';
import { Reserva } from '../../model/reserva.model';
import { ReservasService } from '../../service/reservas.service';
import { Cliente } from '../../model/cliente.model';
import { ClientesService } from '../../service/clientes.service';
import { MessageService } from 'primeng/api';
  import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pagos',
  standalone: false,
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos {

  pagos: Pago[] = [];
  pagosConInfo: any[] = [];

  reservas: Reserva[] = [];
  clientes: Cliente[] = [];
  tiposPago: TipoPago[] = [];
  adelantos: Adelanto[] = [];

  totalRecaudado: number = 0;
  totalPendiente: number = 0;
  totalAdelantos: number = 0;
  totalTransacciones: number = 0;

  constructor(
    private pagosService: PagosService,
    private reservasService: ReservasService,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    forkJoin({
      reservas: this.reservasService.listar(),
      clientes: this.clientesService.listar(),
      pagos: this.pagosService.listar(),
      tiposPago: this.pagosService.listarTiposPago(),
      adelantos: this.pagosService.listarAdelantos()
    }).subscribe(({ reservas, clientes, pagos, tiposPago, adelantos }) => {
      this.reservas = reservas;
      this.clientes = clientes;
      this.pagos = pagos;
      this.tiposPago = tiposPago;
      this.adelantos = adelantos;

      this.completarData(); // Ahora sí con todos los datos cargados
    });
  }

  listarReservas() {
    this.reservasService.listar().subscribe(r => this.reservas = r);
  }

  listarClientes() {
    this.clientesService.listar().subscribe(c => this.clientes = c);
  }

  listarPagos() {
    this.pagosService.listar().subscribe(p => {
      this.pagos = p;
      this.completarData();
    });
  }

  listarTiposPago() {
    this.pagosService.listarTiposPago().subscribe(t => this.tiposPago = t);
  }

  listarAdelantos() {
    this.pagosService.listarAdelantos().subscribe(a => this.adelantos = a);
  }

  completarData() {
    this.pagosConInfo = this.pagos
      .map(p => {
        // Buscar la reserva que contiene este pago
        const reserva = this.reservas.find(r => r.id_pagos === p.id);
        if (!reserva) return null; // ignorar pagos sin reserva

        // Obtener cliente
        const cliente = this.getCliente(reserva.id_cliente);

        // Tipo de pago
        const tipoPago = this.getTipoPago(p.id_tipo_pago);

        // Valor del adelanto

        // Adelanto en porcentaje
        const porcentajeAdelanto = this.getValorAdelanto(p.id_adelanto); // ej: 10, 20, 35
        const valorAdelanto = reserva.total * (porcentajeAdelanto / 100);

        // Calcular saldo
        const total = reserva.total ?? 0;
        // Saldo
        const saldo = reserva.total - valorAdelanto;

        return {
          id: p.id,
          id_reserva: reserva.id,
          cliente: cliente,
          total: total,
          adelanto: valorAdelanto,
          porcentaje: porcentajeAdelanto,
          saldo: saldo,
          metodo: tipoPago,
          fecha: reserva.fecha,
          estado: reserva.estado ?? 'N/A'
        };
      })
      .filter(p => p !== null); // eliminar pagos sin reserva

    // Calcular resúmenes
    this.calcularResumenes();
  }

  getReserva(idReserva: number | undefined): Reserva | undefined {
    if (!idReserva) return undefined;
    return this.reservas.find(r => r.id === idReserva);
  }

  getCliente(idCliente: number | undefined): string {
    if (!idCliente) return 'N/A';
    const c = this.clientes.find(cl => cl.id === idCliente);
    return c ? c.nombre : 'N/A';
  }

  getTipoPago(idTipo: number | undefined): string {
    if (!idTipo) return 'N/A';
    const t = this.tiposPago.find(tp => tp.id === idTipo);
    return t ? t.nombre : 'N/A';
  }

  getValorAdelanto(idAdelanto: number | undefined): number {
    if (!idAdelanto) return 0;
    const a = this.adelantos.find(ad => ad.id === idAdelanto);
    return a ? a.valor : 0;
  }

  calcularResumenes() {
    this.totalTransacciones = this.pagosConInfo.length;

    // Total de adelantos (sumando todos los adelantos)
    this.totalAdelantos = this.pagosConInfo.reduce((acc, p) => acc + p.adelanto, 0);

    // Total recaudado = sumatoria de adelantos de reservas pagadas
    this.totalRecaudado = this.pagosConInfo
      .reduce((acc, p) => acc + p.adelanto, 0);

    // Total pendiente = sumatoria de saldo de reservas que no estén totalmente pagadas
    this.totalPendiente = this.pagosConInfo
      .reduce((acc, p) => acc + p.saldo, 0);
  }

}
