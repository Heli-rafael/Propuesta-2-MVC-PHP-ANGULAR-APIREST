import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../model/pago.model';
import { TipoPago } from '../model/pago.model';
import { Adelanto } from '../model/pago.model';
import { ApiConfig } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private apiUrl = `${ApiConfig.apiUrl}pagos.php`;
  private tipoPagoUrl = `${ApiConfig.apiUrl}tipopago.php`;
  private adelantoUrl = `${ApiConfig.apiUrl}adelanto.php`;

  constructor(private http: HttpClient) {}

  // ===================== PAGOS =====================
  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}?accion=listar`);
  }

  obtener(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}?accion=obtener&id=${id}`);
  }

  crear(pago: Pago): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?accion=crear`, pago);
  }

  actualizar(id: number, pago: Pago): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?accion=actualizar&id=${id}`, pago);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?accion=eliminar&id=${id}`);
  }

  // ===================== TIPO PAGO =====================
  listarTiposPago(): Observable<TipoPago[]> {
    return this.http.get<TipoPago[]>(`${this.tipoPagoUrl}?accion=listar`);
  }

  obtenerTipoPago(id: number): Observable<TipoPago> {
    return this.http.get<TipoPago>(`${this.tipoPagoUrl}?accion=obtener&id=${id}`);
  }

  crearTipoPago(tipo: TipoPago): Observable<any> {
    return this.http.post<any>(`${this.tipoPagoUrl}?accion=crear`, tipo);
  }

  actualizarTipoPago(id: number, tipo: TipoPago): Observable<any> {
    return this.http.put<any>(`${this.tipoPagoUrl}?accion=actualizar&id=${id}`, tipo);
  }

  eliminarTipoPago(id: number): Observable<any> {
    return this.http.delete<any>(`${this.tipoPagoUrl}?accion=eliminar&id=${id}`);
  }

  // ===================== ADELANTO =====================
  listarAdelantos(): Observable<Adelanto[]> {
    return this.http.get<Adelanto[]>(`${this.adelantoUrl}?accion=listar`);
  }

  obtenerAdelanto(id: number): Observable<Adelanto> {
    return this.http.get<Adelanto>(`${this.adelantoUrl}?accion=obtener&id=${id}`);
  }

  crearAdelanto(adelanto: Adelanto): Observable<any> {
    return this.http.post<any>(`${this.adelantoUrl}?accion=crear`, adelanto);
  }

  actualizarAdelanto(id: number, adelanto: Adelanto): Observable<any> {
    return this.http.put<any>(`${this.adelantoUrl}?accion=actualizar&id=${id}`, adelanto);
  }

  eliminarAdelanto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.adelantoUrl}?accion=eliminar&id=${id}`);
  }

}
