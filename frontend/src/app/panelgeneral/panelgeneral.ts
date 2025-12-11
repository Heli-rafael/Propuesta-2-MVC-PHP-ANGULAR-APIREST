import { Component } from '@angular/core';
import { ReservasService } from '../../service/reservas.service';
import { PagosService } from '../../service/pagos.service';
import { UsuariosService } from '../../service/usuarios.service';
import { ServicioService } from '../../service/servicio.service';
import { EventoService } from '../../service/evento.service';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Reserva } from '../../model/reserva.model';
import { Adelanto, Pago } from '../../model/pago.model';
import { Usuario } from '../../model/usuario.model';
import { ClientesService } from '../../service/clientes.service';
@Component({
  selector: 'app-panelgeneral',
  standalone: false,
  templateUrl: './panelgeneral.html',
  styleUrl: './panelgeneral.css',
})
export class Panelgeneral {
  // ========================= Resumenes =========================
  reservasActivas = 0;
  adelantosRecibidos = 0;
  pagosPendientes = 0;
  empleadosActivos = 0;

  // ========================= Diagramas =========================
  barData: any = {};
  barOptions: any = {};

  pieData: any = {};
  pieOptions: any = {};

  lineData: any = {};
  lineOptions: any = {};

  // ========================= Tabla =========================
  ingresosAdelantos: any[] = [];

  // ========================= Reservas recientes =========================
  reservasRecientes: any[] = [];

  // ========================= Reservas recientes =========================
  clientes: any[] = [];
  eventos: any[] = [];
  usuarios: any[] = [];


  constructor(
    private reservasService: ReservasService,
    private pagosService: PagosService,
    private usuariosService: UsuariosService,
    private eventoService: EventoService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarResumenes();
    this.cargarDiagramas();
    this.cargarIngresosAdelantos();
    this.cargarReservasRecientes();

    // Cargar datos de referencia
    forkJoin([
      this.usuariosService.listar(),
      this.eventoService.listar(),
      this.clientesService.listar()
    ]).subscribe(([usuarios, eventos, clientes]) => {
      this.usuarios = usuarios;
      this.eventos = eventos;
      this.clientes = clientes;
    });
  }

  getNombreCliente(id: number | undefined): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'N/A';
  }

  getNombreEvento(id: number | undefined): string {
    const evento = this.eventos.find(e => e.id === id);
    return evento ? evento.nombre : 'N/A';
  }

  // ============================================================
  //                CARGAR RESÚMENES
  // ============================================================
  cargarResumenes() {
    forkJoin([
      this.reservasService.listar(),
      this.pagosService.listarAdelantos(),
      this.usuariosService.listar(),
      this.pagosService.listar()
    ]).subscribe(([reservas, adelantos, usuarios, pagos]) => {

      this.reservasActivas = reservas.filter(r => r.estado !== 'Cancelada').length;

      this.adelantosRecibidos = reservas.reduce((acc, r) => {
        const pago = pagos.find(p => p.id === r.id_pagos);
        if (!pago) return acc;
        const adelanto = adelantos.find(a => a.id === pago.id_adelanto);
        if (!adelanto) return acc;

        const porcentaje = adelanto.valor ?? 0;
        const monto = Number(r.total) * (porcentaje / 100);

        return acc + monto;
      }, 0);

      this.pagosPendientes = reservas.reduce((acc, r) => {
        const pago = pagos.find(p => p.id === r.id_pagos);
        if (!pago) return acc;

        const adelanto = adelantos.find(a => a.id === pago.id_adelanto);
        const porcentaje = adelanto ? adelanto.valor : 0;

        const montoAdelanto = Number(r.total) * (porcentaje / 100);
        const saldo = Number(r.total) - montoAdelanto;

        return acc + saldo;
      }, 0);

      this.empleadosActivos = usuarios.filter(u => u.estado === "Activo").length;
    });
  }

  // ============================================================
  //                CARGAR DIAGRAMAS
  // ============================================================
  cargarDiagramas() {

  forkJoin([
    this.reservasService.listar(),
    this.pagosService.listar(),
    this.pagosService.listarAdelantos()
  ]).subscribe(([reservas, pagos, adelantos]) => {

    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    const ingresosMes = new Array(12).fill(0);
    const adelantosMes = new Array(12).fill(0);
    const pendientesMes = new Array(12).fill(0);

    reservas.forEach(r => {
      const fecha = new Date(r.fecha);
      const mes = fecha.getMonth();

      // -------- Ingresos Totales --------
      ingresosMes[mes] += Number(r.total);

      // -------- Adelantos --------
      const pago = pagos.find(p => p.id === r.id_pagos);
      if (!pago) return;

      const ad = adelantos.find(a => a.id === pago.id_adelanto);
      if (!ad) return;

      const porcentaje = ad.valor ?? 0;
      const montoAdelanto = Number(r.total) * (porcentaje / 100);

      adelantosMes[mes] += montoAdelanto;

      // -------- Pagos Pendientes --------
      pendientesMes[mes] += Number(r.total) - montoAdelanto;
    });

    // ================== Estilos PrimeNG ==================
    const docStyle = getComputedStyle(document.documentElement);
    const textColor = docStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = docStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = docStyle.getPropertyValue('--p-content-border-color');

    // ================== BAR CHART ==================
    this.barData = {
      labels: meses,
      datasets: [
        {
          label: 'Total en Reserva',
          data: ingresosMes,
          backgroundColor: 'rgba(139, 92, 246, 0.4)',
          borderColor: 'rgb(139, 92, 246)',
          borderWidth: 1
        },
        {
          label: 'Adelantos',
          data: adelantosMes,
          backgroundColor: 'rgba(6, 182, 212, 0.4)',
          borderColor: 'rgb(6, 182, 212)',
          borderWidth: 1
        },
        {
          label: 'Pagos Pendientes',
          data: pendientesMes,
          backgroundColor: 'rgba(249, 115, 22, 0.4)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1
        }
      ]
    };

    this.barOptions = {
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder }
        }
      }
    };

    // ================== PIE CHART ==================
    forkJoin([this.eventoService.listar(), this.reservasService.listar()])
    .subscribe(([eventos, reservas]) => {

      // Labels: nombres de los eventos
      const labels = eventos.map(e => e.nombre);

      // Data: cantidad de reservas por evento
      const data = eventos.map(e => 
        reservas.filter(r => r.id_evento === e.id).length
      );

      // Colores (se pueden repetir si hay más eventos)
      const backgroundColors = [
        '#FF6384','#36A2EB','#FFCE56','#8BC34A','#FF9F40','#9966FF','#FFCD56','#4BC0C0'
      ];

      this.pieData = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors.slice(0, labels.length)
          }
        ]
      };
    });

    // ================== LINE CHART (Tendencia de Reservas) ==================
    this.reservasService.listar().subscribe(reservas => {

      const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

      // Inicializamos un array de 12 meses con acumulado 0
      const reservasAcumuladasMes = new Array(12).fill(0);

      // Contar reservas por mes
      reservas.forEach(r => {
        const fecha = new Date(r.fecha);
        const mes = fecha.getMonth(); // 0-11
        reservasAcumuladasMes[mes] += 1;
      });

      // Convertir a acumulado para forma de S
      for (let i = 1; i < 12; i++) {
        reservasAcumuladasMes[i] += reservasAcumuladasMes[i - 1];
      }

      const docStyle = getComputedStyle(document.documentElement);
      const textColor = docStyle.getPropertyValue('--p-text-color');
      const surfaceBorder = docStyle.getPropertyValue('--p-content-border-color');

      this.lineData = {
        labels: meses,
        datasets: [
          {
            label: 'Tendencia de Reservas',
            data: reservasAcumuladasMes,
            fill: false,
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.4)',
            tension: 0.4 // suaviza la curva tipo "S"
          }
        ]
      };

      this.lineOptions = {
        plugins: {
          legend: { labels: { color: textColor } }
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { color: surfaceBorder }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              //stepSize: 1,
              //precision: 0 
            },
            grid: { color: surfaceBorder }
          }
        }
      };


    });


  });
}

  // ============================================================
  //           TABLA INGRESOS VS ADELANTOS
  // ============================================================
  cargarIngresosAdelantos() {
    forkJoin([
      this.reservasService.listar(),
      this.pagosService.listarAdelantos()
    ]).subscribe(([reservas, adelantos]) => {

      this.ingresosAdelantos = reservas.map(r => {
        const ad = adelantos.find(a => a.id === r.id);
        const porcentaje = ad ? ad.valor : 0;
        const monto = Number(r.total) * (porcentaje / 100);

        return {
          total: Number(r.total),
          adelanto: monto,
          saldo: Number(r.total) - monto
        };
      });
    });
  }

  // ============================================================
  //               RESERVAS RECIENTES
  // ============================================================
  cargarReservasRecientes() {
    this.reservasService.listar().subscribe(res => {
      this.reservasRecientes = res
        .sort((a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
        .slice(0, 5);
    });
  }
}
