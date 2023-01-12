import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CODIGO_CONSULTA_EMERGENCIA, CODIGO_ADMISION_EMERGENCIA, CODIGO_CLINICO_EMERGENCIA, MOMENTO_MEDICION_EMERGENCIA, MOMENTO_MEDICION_TRIAGE } from 'src/app/services/constantes';
import { PersonaService } from 'src/app/services/service.index';
import { UsuarioRoleAccionService } from 'src/app/services/utility/usuario-role-accion.service';
import { Persona, TipoBusqueda } from 'src/app/shared/models/persona/persona.models';


@Component({
  selector: 'app-agregar-datos-clinicos',
  templateUrl: './agregar-datos-clinicos.component.html',
  styleUrls: ['./agregar-datos-clinicos.component.scss']
})
export class AgregarDatosClinicosComponent implements OnInit, OnDestroy {
  public busquedaPorTipo: string = 'persona';
  public busqueda: TipoBusqueda;
  public persona: Persona;
  public mostrarBusqueda: boolean = true;
  public mostrarDatosClinicos: boolean = false;
  private $suscripcion: Subscription;
  public nombreCompleto: string = '';
  public formulario: FormGroup;
  public momentoDato:string=MOMENTO_MEDICION_TRIAGE;

  public habilitarRegistroDesconocido: boolean = false;
 //public habilitarRegistroReciennacido: boolean = false;
 // public habilitarBusqueda: boolean = true;

  constructor(
    private personaService: PersonaService,
    private formbuilder: FormBuilder,
    private usuarioAccionService: UsuarioRoleAccionService,
  ) {
    this.InitFormulario();
  }

  ngOnInit() {
    this.EstablecerValoresTipoBusqueda();
    this.ObtenerDatosPersona();
  }

  InitFormulario() {
    this.formulario = this.formbuilder.group({
      opcionesBusqueda: new FormControl(null, [])
    });
  }

  //* SE ESTABLECEN LOS VALORES POR DEFECTO
  EstablecerValoresTipoBusqueda() {
    //debugger;
    this.busqueda = {
      esRecienNacido: false,
      esDesconocido: false,
      esNoIdentificado: true,
      cancelar: false,
      creacionPersona: {
        persona: true,
        recienNacido: false,
        identificada: false,
        desconocido: false,
      }
    };
    this.personaService.setResultadoBusqueda(this.busqueda);
  }

  ObtenerDatosPersona() {
    this.$suscripcion = this.personaService.personSelected$
      .subscribe((d) => {
        //debugger;
        if (d) {
          this.persona = d;
          this.mostrarBusqueda = false;
          this.mostrarDatosClinicos = true;
        }
      });
  }

  ToogleEsDesconocido(check) {
    //debugger;
    //this.buscadorPersona.cancelar();
    this.habilitarRegistroDesconocido = true;
   // this.habilitarBusqueda = false;
   // if (this.habilitarRegistroDesconocido) {
      this.busqueda = {
        esRecienNacido: false,
        esDesconocido: true,
        esNoIdentificado: false,
        cancelar: false,
      };
      this.personaService.setResultadoBusqueda(this.busqueda);
   // }
  }

  ToogleRecienNacido(check) {
    //debugger;
    this.habilitarRegistroDesconocido = false;
    this.busqueda = {
      esRecienNacido: true,
      esDesconocido: false,
      esNoIdentificado: false,
      cancelar: false,
    };
    this.personaService.setResultadoBusqueda(this.busqueda);
  }

  ObtenerFormulario(valor: boolean) {
   //debugger;
    this.habilitarRegistroDesconocido = false;
    this.formulario.get('opcionesBusqueda').setValue(null);
    this.EstablecerValoresTipoBusqueda();
  }

  ngOnDestroy() {
    this.personaService.personSelected$.next(null);
    this.$suscripcion.unsubscribe();
  }

  NuevaBusqueda() {
    this.mostrarBusqueda = true;
    this.mostrarDatosClinicos = false;
  }

  HabilitarPorRoles(accion: string) {
    //debugger;
    let habilitar: boolean = false;
    habilitar = this.usuarioAccionService.HabilitarPorRoles(accion, CODIGO_CLINICO_EMERGENCIA);
    return habilitar;
  }

}
