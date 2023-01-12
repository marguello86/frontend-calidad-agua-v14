import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
//import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ESPECIALIDADCODIGO, SYSTEM, USER } from 'src/app/services/constantes';
import { CatalogosEmergenciaService, LoginService, SistemaService, UnidadSaludService, UsuarioService } from 'src/app/services/service.index';
import { UserObj } from 'src/app/shared/models/reportes/userobj';
import { Silais, silaisPorUsuario, silaisUnidadesUsuario } from 'src/app/shared/models/silais/silais';
import { Sistema } from 'src/app/shared/models/sistema/sistema';

@Component({
  selector: 'app-dialogo-asignar-unidad',
  templateUrl: './dialogo-asignar-unidad.component.html',
  styleUrls: ['./dialogo-asignar-unidad.component.scss']
})
export class DialogoAsignarUnidadComponent implements OnInit, AfterViewInit, OnDestroy {
  //silaisAutoCompleta=FormControl();
  //* SE DECLARA VARIABLE DE TIPO SUSCRIPCION PARA EL API
  public usuario: UserObj;
  public sistema: Sistema;
  public silais: Silais;
  public seleccionSilais: silaisPorUsuario;
  //public 
  public mensajeError: string;
  public habilitarUnidad: boolean = false;
  //* AUTOCOMPLETE
  public silaisUsuario: silaisPorUsuario[];
  public unidadSilais: silaisUnidadesUsuario[];
  public opcionFiltro: Observable<silaisPorUsuario[]>;
  public opcionFiltroUnidad: Observable<silaisUnidadesUsuario[]>
  public mostrarCancelar: boolean = false;

  public formulario: FormGroup;

  constructor(
    private unidadService: UnidadSaludService,
    private seguridadService: LoginService,
    private sistemaService: SistemaService,
    private usuarioService: UsuarioService,
    public catalogosEmergenciaService: CatalogosEmergenciaService,
    private spinner: NgxSpinnerService,
    private dialogo: MatDialogRef<DialogoAsignarUnidadComponent>
    , @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ObtenerSilaisPorUsuarioSistema();
    if (this.data) {
      if (this.data['mostarBoton']) {
        this.mostrarCancelar = this.data.mostarBoton;
      }
    }
    //this.Autocompletar();
  }
  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

  //* SE CREA FORMULARIO REACTIVO
  CrearFormulario() {
    this.formulario = this.formbuilder.group({
      silais: [null, Validators.required],
      unidad: [null, Validators.required]
    });
  }

  //* METODO QUE OBTIENE EL SILAIS SELECCIONADO
  SeleccionarSilais() {
    this.seleccionSilais = this.formulario.get('silais').value; //this.formulario.getRawValue();
    this.formulario.get('unidad').patchValue(null);
    this.habilitarUnidad = false;
    if (!this.unidadSilais) {
      this.ObtenerUnidadSaludPorSilais(this.usuario.id, this.sistema.id, this.seleccionSilais.id);
    }
    else
    {
      this.ObtenerUnidadSaludPorSilais(this.usuario.id, this.sistema.id, this.seleccionSilais.id);
    }
  }

  //* METODO PARA EL AUTOCOMPLETADO DE LA CAJA DE TEXTO SILAIS
  AutocompletarSilais() {
    this.opcionFiltro = this.formulario.valueChanges
      .pipe(
        startWith(''),
        //map(value => typeof value === 'string' ? value : value.name),
        map(value => value ? this.FiltroSilais(value.silais) : this.silaisUsuario.slice())
      );
  }
  //*METODO QUE REALIZA EL FILTRO POR EL NOMBRE
  private FiltroSilais(valor: any): silaisPorUsuario[] {
    if (valor) {
      const filterValue = (typeof valor === 'string' ? valor.toLowerCase() : valor.nombre.toLowerCase());
      return this.silaisUsuario.filter(e => e.nombre.toLowerCase().includes(filterValue));
    }
  }
  //* METODO QUE MUETRAS EL DATO BUSCADO  
  MostrarInformacionSilais(valor: silaisPorUsuario): string {
    return valor && valor.nombre ? valor.nombre : '';
  }

  //* METODO PARA EL AUTOCOMPLETADO DE LA CAJA DE TEXTO SILAIS
  AutocompletarUnidad() {
    this.opcionFiltroUnidad = this.formulario.valueChanges
      .pipe(
        startWith(''),
        //map(value => typeof value === 'string' ? value : value.name),
        map(value => value ? this.FiltroUnidad(value.unidad) : this.unidadSilais[0].unidades.slice())
      );
  }
  //*METODO QUE REALIZA EL FILTRO POR EL NOMBRE
  private FiltroUnidad(valor: any): silaisUnidadesUsuario[] {
    if (valor) {
      const filterValue = (typeof valor === 'string' ? valor.toLowerCase() : valor.nombre.toLowerCase());
      return this.unidadSilais[0].unidades.filter(e => e.nombre.toLowerCase().includes(filterValue));
    }
  }
  //* METODO QUE MUETRAS EL DATO BUSCADO  
  MostrarInformacionUnidad(valor: silaisUnidadesUsuario): string {
    return valor && valor.nombre ? valor.nombre : '';
  }

  //* ESTABLECER UNIDAD DE SALUD POR USUARIO
  EstablecerUnidadSilais() {
    let datosFormulario = this.formulario.getRawValue();
    let objetoUnidad = {
      id: this.usuario.id,
      silais: datosFormulario.silais,
      unidad: datosFormulario.unidad
    }
    localStorage.setItem('unidadUsuarioeEmg', JSON.stringify(objetoUnidad));
    this.unidadService.EstablecerUnidadSalud(datosFormulario.unidad);
    this.dialogo.close(false);
  }

  /**
 * ACA SE ENCUENTRAN TODOS LOS METODOS DE CONSUMO DE APIS
 */
  //METODO QUE TE OBTIENE LOS SILAIS AFILIADO A LA PERSONA
  ObtenerSilaisPorUsuarioSistema() {
    //this.spinner.show();
    this.usuario = this.seguridadService.getLocalStorageItem(USER);
    this.sistema = this.sistemaService.getLocalStorageItem(SYSTEM);
    //console.log(this.usuarioService.estaAutorizado$);

    this.unidadService.cargarSilais(this.usuario.id, this.sistema.id).subscribe({
      next: (d: any) => { this.silaisUsuario = d.data },
      error: (e: HttpErrorResponse) => { this.mensajeError = e.message },
      complete: () => {
        //this.spinner.hide();
        this.AutocompletarSilais();
      }
    });

    if (this.usuario.perfil.nombre.toUpperCase() !== 'NIVEL CENTRAL') {

    }
  }
  // METODO QUE OBTIENE LAS UNIDADES DE SALUD CORRESPONDIENTE POR SILAIS
  ObtenerUnidadSaludPorSilais(idUsuario, idSistema, idSilais) {
    this.unidadService.cargarUnidades(idUsuario, idSistema, idSilais).subscribe({
      next: (d: any) => { this.unidadSilais = d.data },
      error: (e: HttpErrorResponse) => { this.mensajeError = e.message },
      complete: () => { 
        this.spinner.hide();
        if (this.unidadSilais) {
          this.habilitarUnidad = true;
          //console.log('unidad', this.unidadSilais);
          this.AutocompletarUnidad();
        }
      }
    });
  }

}