import { Component } from '@angular/core';
import { Usuario } from '../../model/usuario.model';
import { UsuariosService } from '../../service/usuarios.service';
import { MessageService } from 'primeng/api';
import { Rol } from '../../model/roles.model';
import { RolesService } from '../../service/roles.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  roles: Rol[] = [];

  estados: { label: string, value: string }[] = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' }
  ];
  
  busqueda: string = '';

  modalVisible = false;
  modalEliminarVisible = false;
  modalTitulo = 'Agregar Usuario';

  usuarioModal: Usuario = { nombre: '', correo: '', password: '', estado: 'Activo', rol: '' };
  usuarioSeleccionado: Usuario | null = null;
  

  constructor(
    private usuariosService: UsuariosService, 
    private rolesService:RolesService, 
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.listarRoles();
  }

  listarRoles() {
  this.rolesService.listar().subscribe(data => {
    this.roles = data || [];
    this.filtrarRol(); // <-- ahora se ejecuta después de recibir los roles
  });
}

  cargarUsuarios() {
    this.usuariosService.listar().subscribe(res => {
      this.usuarios = res || [];
      this.usuariosFiltrados = [...this.usuarios];
    });
  }

  filtrar() {
    const texto = this.busqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      (u.rol?.toLowerCase().includes(texto))
    );
  }

  abrirModalAgregar() {
    this.modalTitulo = 'Agregar Usuario';
    this.usuarioModal = { nombre: '', correo: '', password: '', estado: 'Activo', rol: '' };
    this.modalVisible = true;
  }

  abrirModalEditar(u: Usuario) {
    this.modalTitulo = 'Editar Usuario';
    const rolSeleccionado = this.roles.find(r => r.nombre === u.rol);
    this.usuarioModal = { ...u, password: '',id_rol: rolSeleccionado ? rolSeleccionado.id : undefined }; // no mostrar contraseña
    this.usuarioSeleccionado = u;
    this.modalVisible = true;
  }

  abrirModalEliminar(u: Usuario) {
    this.usuarioSeleccionado = u;
    this.modalEliminarVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  cerrarModalEliminar() {
    this.modalEliminarVisible = false;
  }

  guardar() {
    if (!this.usuarioModal.nombre || !this.usuarioModal.correo) return;

    if (this.usuarioModal.id) {
      this.usuariosService.actualizar(this.usuarioModal.id, this.usuarioModal).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.modalVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente' });
        },
        error: (err) => {
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
      this.usuariosService.crear(this.usuarioModal).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.modalVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
        },
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' })
      });
    }
  }

  eliminar() {
    if (!this.usuarioSeleccionado || !this.usuarioSeleccionado.id) return;
    this.usuariosService.eliminar(this.usuarioSeleccionado.id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.modalEliminarVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado' });
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' })
    });
  }


  //============================
  // Roles
  //============================

  rolesFiltrados: Rol[] = [];
  busquedaRol: string = '';

  modalRoles = false;
  
  modalFormRol = false;
  modalTituloRol = '';
  rolModal: Rol = { nombre: '' };

  modalVerRol = false;
  modalEliminarRol = false;

  rolSeleccionado: Rol = { nombre: '' };

  filtrarRol() {
    this.rolesFiltrados = this.roles.filter(r => 
      r.nombre.toLowerCase().includes(this.busquedaRol.toLowerCase())
    );
  }
  
  abrirModalRoles() {
    this.modalRoles = true;
  }

  abrirModalAgregarRol() {
    this.modalTituloRol = 'Agregar Rol';
    this.rolModal = { nombre: '' };
    this.modalFormRol = true;
  }

  abrirModalEditarRol(rol: Rol) {
    this.modalTituloRol = 'Editar Rol';
    this.rolModal = { ...rol };
    this.modalFormRol = true;
  }

  cerrarModalRol() {
    this.modalFormRol = false;
  }

  guardarRol() {
    if (this.modalTituloRol.includes('Agregar')) {
      this.rolesService.crear(this.rolModal).subscribe(() => {
        this.listarRoles();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol agregado' });
        this.modalFormRol = false;
      });
    } else {
      if (!this.rolModal.id) return;
      this.rolesService.actualizar(this.rolModal.id, this.rolModal).subscribe(() => {
        this.listarRoles();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol actualizado' });
        this.modalFormRol = false;
      });
    }
  }

  abrirModalVerRol(rol: Rol) {
    this.rolSeleccionado = { ...rol };
    this.modalVerRol = true;
  }

  cerrarModalVerRol() {
    this.modalVerRol = false;
  }

  abrirModalEliminarRol(rol: Rol) {
    this.rolSeleccionado = { ...rol };
    this.modalEliminarRol = true;
  }

  cerrarModalEliminarRol() {
    this.modalEliminarRol = false;
  }

  eliminarRol() {
    if (!this.rolSeleccionado.id) return;
    this.rolesService.eliminar(this.rolSeleccionado.id).subscribe(() => {
      this.listarRoles();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado' });
      this.modalEliminarRol = false;
    });
  }
}
