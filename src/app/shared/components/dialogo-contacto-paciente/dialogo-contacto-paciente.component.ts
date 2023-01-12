import { ChangeDetectorRef, Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  PersonaService,
  PacienteService,
  SnhCatHospitalarioService,
  CatalogosEmergenciaService,
} from "src/app/services/service.index";
import { Persona } from "../../models/persona/persona.models";
import { TPO_FND_CT } from "../catalogos/catalogos.const";
import { BuscadorPersonasGenericoComponent } from "../persona/buscador-personas-generico/buscador-personas-generico.component";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { SYSTEM, UNIDAD_USUARIO } from "src/app/services/constantes";
import Swal from "sweetalert2";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CT_TIPO_RELACIONES } from "../../interfaces/persona-const";
@Component({
  selector: "app-dialogo-contacto-paciente",
  templateUrl: "./dialogo-contacto-paciente.component.html",
  styleUrls: ["./dialogo-contacto-paciente.component.scss"],
})
export class DialogoContactoPacienteComponent implements OnInit {
  @Input() dt: any = {};
  contactourgencia: FormGroup;
  personSelected: Persona;
  dataContact: { datos: any[] };
  public residenciaContacto: any = null;
  public residenciaContactoCambiado: any = null;
  public tipoRelacion: any;
  private subsVar: Subscription;
  controlesContactos: boolean = false;
  validoUrg: boolean = false;
  datosContactoarray: any = {
    id: 0,
    pacienteId: 0, //paciente
    tipoRelacionId: 0,
    personaId: 0, //contacto
    tipoPersona: 1,
    contactoNombre: null,
    departamentoId: 0,
    municipioId: 0,
    comunidadId: 0,
    direccionhabitual: null,
    telefono1: null,
    telefono2: null,
    controlRegistro: {
      sistemaProcedenciaId: 0,
      unidadSaludProcedenciaId: 0,
      usuarioRegistro: null,
    },
  };
  private subscription$: Subscription;

  private _onDestroy = new Subject<void>();
  ContactopacienteSelected: Persona;
  sistemaLS: any;
  unidadSaludUsuario: any;
  usuarioSistema: any;
  private accion: string;
  private nombreCompleto: string;
  get buscaCodigoSup() {
    return TPO_FND_CT;
  }
  get cdgCatRelacion() {
    return CT_TIPO_RELACIONES;
  }
  constructor(
    private dialogRef: MatDialogRef<DialogoContactoPacienteComponent>,
    private spinner: NgxSpinnerService,
    public personaService: PersonaService,
    public pacienteService: PacienteService,
    // public catalogosService: SnhCatHospitalarioService,
    public catalogoService: CatalogosEmergenciaService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private _changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contactourgencia = this.formBuilder.group({
      id: [{ value: 0, disabled: false }],
      pacienteId: [{ value: 0, disabled: false }],
      tipoRelacionId: [{ value: 0, disabled: true }],
      personaId: [{ value: 0, disabled: false }],
      tipoPersona: [{ value: "1", disabled: false }],
      contactoNombre: [{ value: null, disabled: false }],
      departamentoId: [{ value: 0, disabled: false }],
      municipioId: [{ value: 0, disabled: false }],
      comunidadId: [{ value: 0, disabled: false }],
      direccionHabitual: [{ value: null, disabled: false }],
      telefono1: [{ value: null, disabled: false }],
      telefono2: [{ value: null, disabled: false }],
      controlRegistro: this.formBuilder.group({
        sistemaProcedenciaId: [{ value: 0, disabled: false }],
        unidadSaludProcedenciaId: [{ value: 0, disabled: false }],
        usuarioRegistro: [{ value: null, disabled: false }],
        usuarioModificacion: [{ value: null, disabled: false }],
        pasivo: [{ value: false, disabled: false }],
      }),
    });

    this.contactourgencia.valueChanges.subscribe({
      next: (val: any) => {
        // console.log("this.contactourgencia ha cambiado: ", this.contactourgencia.getRawValue());
      },
    });
  }

  ngOnInit() {

    if (this.data.datosContacto) {
      // console.log('entramos actualizar: ', this.data.datosContacto);
      this.getDatosContactoUpdate();
    }
    this.inicializador();
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe()
    }
  }
  getDatosContactoUpdate() {
    //debugger
    this.contactourgencia.get('id').patchValue(this.data.datosContacto.id);
    this.contactourgencia.get('personaId').patchValue(this.data.datosContacto.personaId);
    this.contactourgencia.get('pacienteId').patchValue(this.data.datosContacto.pacienteId);
    this.contactourgencia.get('tipoRelacionId').patchValue(this.data.datosContacto.tipoRelacionId);
    this.contactourgencia.get('contactoNombre').patchValue(this.data.datosContacto.personaNombre);
    this.contactourgencia.get('telefono1').patchValue(this.data.datosContacto.telefono1);
    this.contactourgencia.get("tipoRelacionId").enable();
    this.residenciaContacto = {
      departamento: this.data.datosContacto.departamentoId,
      municipio: this.data.datosContacto.municipioId,
      comunidad: this.data.datosContacto.comunidadId,
      direccionDomicilio: this.data.datosContacto.direccionHabitual,
      personaNombre: this.data.datosContacto.personaNombre
    };
    // console.log('contactourgencia form values: ', this.contactourgencia.value);
    this.llamarChildEvent(this.residenciaContacto);
  }

  cerrarDialogo() {
    var limpiarBuscador = true;
    this.dialogRef.close(limpiarBuscador);
  }

  selectRelContacto(e) {
    if (!e) {
      return;
    } else {
      this.contactourgencia.get("tipoRelacionId").patchValue(e.id);
    }
  }

  clearContact() {
    // console.log("que vale: this.crtDataRes; ", this.crtDataRes);
    this.validoUrg = false;
    this.selectRelContacto(null);
    this.residenciaContacto = null;
    this.controlesContactos = false;
    this.contactourgencia.reset();
    this.dt = null;
  }

  guardarContacto(e?: any) {
    //debugger;
    var objeto: any;
    var data: any;
    if (!this.ContactopacienteSelected) {
      Swal.fire("Aviso", "Debe seleccionar un contacto", "warning");
      //this.clearContact();
      return;
    }
    if (!this.contactourgencia.get("tipoRelacionId").value) {
      Swal.fire("Aviso", "Debe seleccionar un parentesco", "warning");
      //this.clearContact();
      return;
    }
    // this.emergenciaForm.get("contactourgencia").patchValue(this.ContactopacienteSelected);
    this.datosContactoarray.controlRegistro.sistemaProcedenciaId = this.sistemaLS.id;
    this.datosContactoarray.controlRegistro.unidadSaludProcedenciaId = this.unidadSaludUsuario.unidad.id;
    this.datosContactoarray.controlRegistro.usuarioRegistro = this.usuarioSistema.username;
    this.datosContactoarray.pacienteId = this.personSelected.paciente.id;
    this.datosContactoarray.personaId = this.ContactopacienteSelected.id;
    this.datosContactoarray.telefono1 = this.contactourgencia.get('telefono1').value;
    this.datosContactoarray.telefono2 = this.contactourgencia.get('telefono2').value;
    this.datosContactoarray.comunidadId = this.ContactopacienteSelected.divisionPolitica.residencia.comunidad.id;
    this.datosContactoarray.municipioId = this.ContactopacienteSelected.divisionPolitica.residencia.departamento.id;
    this.datosContactoarray.primerNombre = this.ContactopacienteSelected.primerNombre;
    this.datosContactoarray.segundoNombre = this.ContactopacienteSelected.segundoNombre;
    this.datosContactoarray.primerApellido = this.ContactopacienteSelected.primerApellido;
    this.datosContactoarray.segundoApellido = this.ContactopacienteSelected.segundoApellido;
    this.datosContactoarray.tipoRelacionId = this.contactourgencia.get('tipoRelacionId').value;
    this.contactourgencia.patchValue(this.datosContactoarray);
    this.contactourgencia.get("direccionHabitual").patchValue(this.datosContactoarray.direccionhabitual);
    objeto = this.contactourgencia.value;
    this.dataContact = { datos: [objeto] };
    //console.log("emergenciaForm: ", JSON.stringify(this.contactourgencia.getRawValue()));
    //console.log("objeto de contacto: ", JSON.stringify(this.personSelected));
    // console.log("objeto de dataContact: ", JSON.stringify(this.dataContact, null, 2));
    this.pacienteService.insertarContactoPaciente(this.dataContact).subscribe({
      next: (resultado: any) => {
        this.spinner.show();
        if (resultado.error) {
          console.error('resultado error: ', resultado)
          Swal.fire("Error", resultado.error.mensajeDetalle, "error");
        } else {
          this.spinner.hide();
          data = resultado;
          //console.log("el resultado exitoso es: ", data);
          Swal.fire(
            "Guardar Contacto Paciente",
            "contacto de paciente guardado con éxito",
            "success"
          );
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        Swal.fire("error", err, "error");
      },
      complete: () => {
        this.spinner.hide();
        if (data) {
          this.dialogRef.close();
          //this.obtieneContactosPaciente(this.personSelected.paciente.id);
        }
      },
    });
  }

  obtieneTiposRelacion() {
    var datos: any;
    var errores: any;
    var mensaje: any;
    this.catalogoService
      //.ObtenerCatalogoComun("PARENTESCO", 2)
      .ObtenerCatalogoComun("TPRELACION", 2)
      .subscribe({
        next: (respuesta: any) => {
          //debugger;
          errores = respuesta.error;
          if (errores) {
            Swal.fire("Error", errores.mensaje, "error");
          } else {
            this.tipoRelacion = respuesta.data[0].childrens.filter(e => e.pasivo == false);
          }
        },
        error: (e: HttpErrorResponse) => {
          //this.spinner.hide();
          Swal.fire("error", e.message, "error");
        },
        complete: () => { },
      });
  }

  selectTipoRelacion(e) {
    //console.log('tipo de relación seleccionada: ', e);
  }

  asignaDataResidenciaContacto(accion?: string, contactoPersona?: any) {
    if (!contactoPersona) {
      return;
    }
    this.pacienteService.contactoSelected$.subscribe({
      next: (p: any) => {
        if (p) {
          //console.log("contactoSelected Subject: ", p);
          this.ContactopacienteSelected = p;
        }
        // else {
        //   Swal.fire('Error', 'No es posible obtener datos de contacto', 'error');
        // }
      },
      error: (err: any) => {
        Swal.fire("error", err, "error");
      },
      complete: () => { },
    });
    // this.residenciaContacto = contactoPersona;
    this.residenciaContacto = contactoPersona.divisionPolitica.residencia;
    this.residenciaContacto = {
      departamento: contactoPersona.divisionPolitica.residencia.departamento.id,
      municipio: contactoPersona.divisionPolitica.residencia.municipio.id,
      comunidad: contactoPersona.divisionPolitica.residencia.comunidad.id,
      direccionDomicilio: contactoPersona.divisionPolitica.residencia.personaDireccion,
    };
    //console.log('que vale residenciaContacto en DIALOG: ', this.residenciaContacto);

    if (this.residenciaContacto) {
      this.contactourgencia.get("tipoRelacionId").enable();
      this.contactourgencia.get('municipioId').patchValue(this.residenciaContacto.municipio);
      this.contactourgencia.get('comunidadId').patchValue(this.residenciaContacto.comunidad);
      this.contactourgencia.get('departamentoId').patchValue(this.residenciaContacto.departamento);
      this.contactourgencia.get('direccionHabitual').patchValue(this.residenciaContacto.direccionDomicilio);

      // console.log('this.contactourgencia: ', this.contactourgencia.getRawValue());

      this.controlesContactos = true;
      /* if (accion === 'Guardar') {
         this.llamarChildEvent(this.residenciaContacto);
       }
       else {
         this.llamarChildEvent(this.residenciaContacto);
       }*/

      // this.contactourgencia.markAsPristine();
    }
    else {
      Swal.fire('error', 'No se puede obtener datos de contacto de paciente', 'error');
    }
  }
  llamarChildEvent(e: any) {

    if (!e) {
      return;
    } else {
      if (!this.data.datosContacto) {

        this.datosContactoarray.departamentoId = e.departamento;
        this.datosContactoarray.municipioId = e.municipio;
        this.datosContactoarray.comunidadId = e.comunidad;
        this.datosContactoarray.direccionhabitual = e.direccionDomicilio;
        this.datosContactoarray.contactoNombre = this.nombreCompleto;
        this.contactourgencia.patchValue(this.datosContactoarray);
        //console.log("residenciaContactoCambiado en POST: ", this.datosContactoarray);
      } else {
        this.controlesContactos = true;
        this.datosContactoarray.id = this.data.datosContacto.id;
        this.datosContactoarray.personaId = this.data.datosContacto.personaId;
        this.datosContactoarray.pacienteId = this.data.datosContacto.pacienteId;
        this.datosContactoarray.departamentoId = e.departamento;
        this.datosContactoarray.municipioId = e.municipio;
        this.datosContactoarray.comunidadId = e.comunidad;
        this.datosContactoarray.direccionhabitual = e.direccionDomicilio;
        this.datosContactoarray.telefono1 = this.contactourgencia.get('telefono1').value;
        this.datosContactoarray.telefono2 = this.contactourgencia.get('telefono2').value;
        this.datosContactoarray.tipoRelacionId = this.contactourgencia.get('tipoRelacionId').value;
        //this.contactourgencia.get("contactoNombre").patchValue(this.nombreCompleto);
        this.datosContactoarray.contactoNombre = this.data.datosContacto.personaNombre
        // console.log("Cambios residenciaContactoCambiado PUT: ",this.datosContactoarray);
      }
      //console.log('que this.nombreCompleto vale en childevent: ', this.nombreCompleto);


    }
  }

  actualizarContacto() {
    var objeto: any;
    var datos;
    this.contactourgencia.get("controlRegistro.sistemaProcedenciaId").patchValue(this.sistemaLS.id);
    this.contactourgencia.get("controlRegistro.unidadSaludProcedenciaId").patchValue(this.unidadSaludUsuario.unidad.id);
    this.contactourgencia.get("controlRegistro.usuarioModificacion").patchValue(this.usuarioSistema.username);
    this.contactourgencia.get("controlRegistro.usuarioRegistro").patchValue(this.usuarioSistema.username);
    this.contactourgencia.get('comunidadId').patchValue(this.datosContactoarray.comunidadId);
    this.contactourgencia.get('municipioId').patchValue(this.datosContactoarray.municipioId);
    this.contactourgencia.get('departamentoId').patchValue(this.datosContactoarray.departamentoId);
    this.contactourgencia.get('direccionHabitual').patchValue(this.datosContactoarray.direccionhabitual);
    objeto = this.contactourgencia.getRawValue();
    this.dataContact = { datos: [objeto] };
    //console.log('this.dataContact: ', this.dataContact);

    this.pacienteService
      .actualizarContactoPaciente(this.dataContact)
      .subscribe({
        next: (resultado: any) => {
          //console.log('resultado de actualizar paciente: ', resultado);
          if (resultado.error) {
            //console.log('resultado con errores: ', resultado);
            Swal.fire('error', resultado.mensaje, 'error');
          } else {
            datos = resultado;
            //console.log('se actualiza contacto exitosamente: ', datos);
            Swal.fire("Exito", "Actualizado correctamente", "success");
          }
        },
        error: (err: any) => {
          console.error('error: ', err);
          Swal.fire("error", err, "error");
        },
        complete: () => {
        },
      });
  }

  inicializador() {
    this.personSelected = this.data.datosPersona;
    var sistemaLS = localStorage.getItem(SYSTEM);
    this.sistemaLS = JSON.parse(sistemaLS);
    var CodexpUnico = this.personSelected.paciente.id;
    var unidadUsuarioLS = localStorage.getItem(UNIDAD_USUARIO);
    this.unidadSaludUsuario = JSON.parse(unidadUsuarioLS);
    var usuarioSistemaLS = localStorage.getItem("userObj");
    this.usuarioSistema = JSON.parse(usuarioSistemaLS);
    this.obtieneTiposRelacion();
  }

  muestraBuscador() {
    this.contactourgencia.reset();
    this.clearContact();
    this.accion = 'Guardar';
    var dialogRef: any;
    var datosPersona: Persona = this.personSelected;
    // console.log('datosPersona para Dialogo: ', datosPersona);

    dialogRef = this.dialog.open(BuscadorPersonasGenericoComponent, {
      width: "80%",
      disableClose: true,
      hasBackdrop: true,
      data: { datosPersona },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        //debugger;
        //hacer patchvalue de form contacto
        //data.segundoNombre != undefined ? data.segundoNombre : " "
        var segundoNombre = data.segundoNombre != undefined ? data.segundoNombre : " ";
        var segundoApellido = data.segundoApellido != undefined ? data.segundoApellido : " ";
        this.nombreCompleto = data.primerNombre + ' ' + segundoNombre + ' ' + data.primerApellido + ' ' + segundoApellido;
        //console.log('que vale nombreCompleto: ', this.nombreCompleto);
        this.contactourgencia.get("contactoNombre").patchValue(this.nombreCompleto);
        //console.log('form: ', this.contactourgencia.getRawValue());
        this.asignaDataResidenciaContacto(this.accion, data);
      }

    });
  }

  /* Log de funciones traidas desde informacion-paciente
selectRelContacto(e)
buscaCodigoSup()
cdgCatRelacion()
muestraBuscador()
personSelected: Persona;
BuscadorPersonasGenericoComponent
  */
}
