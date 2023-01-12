import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PersonalMinsaService } from 'src/app/services/service.index';

@Component({
  selector: 'app-minsa-personal-lookup',
  templateUrl: './minsa-personal-lookup.component.html',
  styleUrls: ['./minsa-personal-lookup.component.scss']
})
export class MinsaPersonalLookupComponent implements OnInit, OnChanges, OnDestroy {
  public formulario: FormGroup;
  public listaMinsaPersonal$: Observable<any[]>;
  public arrayMinsaPersonal: any[] = [];
  public showProgress: boolean = false;
  public mostrarNombres: boolean = false;
  public mensaje: string = '';
  public mostrarAlerta: boolean = false;
  private fIdentificacion: string = '';
  private primerNombre: string = '';
  private SegundoNombre: string = '';
  private primerApellido: string = '';
  private segundoApellido: string = '';
  public resetear: boolean = true;

  @Input('entidad') entidad: string = 'Personal de Salud'
  @Input('Requerido') requerido: boolean = false;
  @Input('CodigoMinsa') codigoMinsa: string = '';
  @Input('idMinsaPersonal') idMinsaPersonal: number = 0;
  @Output('SeleccionMinsa') seleccionMinsa: EventEmitter<any> = new EventEmitter<any>(null);
  @ViewChild('pApellido', { static: false }) pApellido: ElementRef;
  @ViewChild('identificacion', { static: false }) identificacion: ElementRef;

  constructor(
    private formbuilder: FormBuilder,
    private minsaPersonalService: PersonalMinsaService,
    private changeDetectorRef: ChangeDetectorRef
    //  private spinner: NgxSpinnerService
  ) {
    this.InicializarFormulario();
  }

  ngOnChanges() {
    //debugger
    if (this.codigoMinsa && this.codigoMinsa != "") {
      this.formulario.get('valor').patchValue(this.codigoMinsa);
      this.BuscarIdentificacion();
    }
    else {
      //console.log('Validar si se puede buscar por ID de MinsaPersonal');
      this.formulario.get('valor').setValue('');
    }
  }

  ngOnInit() {
    if (this.codigoMinsa) {
      if (this.codigoMinsa !== '') {
        this.formulario.get('valor').patchValue(this.codigoMinsa);
        this.BuscarIdentificacion();
      }
    } else {
      if (this.idMinsaPersonal !== 0) {
        this.buscarPorId();
      }
    }
  }

  InicializarFormulario() {
    this.formulario = this.formbuilder.group({
      valor: new FormControl(null, []),
      identificacion: new FormControl(null, [Validators.required]),
      minsapersonalid: new FormControl(),
      primerapellido: new FormControl(null, []),
      primernombre: new FormControl(null, []),
      segundoapellido: new FormControl(null, []),
      segundonombre: new FormControl(null, []),
      pagactual: new FormControl(0, []),
      pagtamanio: new FormControl(100, [])
    })

    //SE LLENAR VALORES PARA CAMPOS DE NOMBRES
    this.formulario.valueChanges.subscribe((d) => {
      //debugger;
      if (this.resetear) {
        this.fIdentificacion = d.valor;
        this.primerNombre = d.primernombre;
        this.SegundoNombre = d.segundonombre;
        this.primerApellido = d.primerapellido;
        this.segundoApellido = d.segundoapellido;
      }
    });

    //SE OBTIENE LOS VALORES PARA EL VALOR IDENTIFICACION
    this.formulario.get('valor').valueChanges.subscribe((d) => {
      this.formulario.get('identificacion').patchValue(d);
    });

  }

  Limpiar() {
    this.formulario.get('valor').setValue(null);
  }

  BuscarIdentificacion() {
    //debugger;
    let criterio = this.formulario.getRawValue();
    delete criterio.primernombre;
    delete criterio.segundonombre;
    delete criterio.primerapellido;
    delete criterio.segundoapellido;
    this.showProgress = true;
    this.ObtenerListaMinsaPersonal(criterio);

  }

  buscarPorId(): void {
    this.formulario.get(['minsapersonalid']).setValue(this.idMinsaPersonal);
    const criterio = this.formulario.getRawValue();
    delete criterio.primernombre;
    delete criterio.segundonombre;
    delete criterio.primerapellido;
    delete criterio.segundoapellido;
    this.showProgress = true;
    this.ObtenerListaMinsaPersonal(criterio);
  }


  async ObtenerListaMinsaPersonal(obj: any) {
    // debugger;
    try {
      if (!this.codigoMinsa) {
        //this.spinner.show();
      }
      let lista = await this.minsaPersonalService.BusquedaAvanzadaNew(obj).toPromise()
      if (lista.error) {
        //this.spinner.hide();
        //console.log('lista', lista.error);
        this.Alertar();

      } else {

        this.mostrarNombres = false;
        this.changeDetectorRef.detectChanges();
        this.arrayMinsaPersonal = lista.data;
        if (!this.codigoMinsa) {
          //this.spinner.hide();
        }
        if (this.codigoMinsa || this.idMinsaPersonal > 0) {
          this.Seleccionar(this.arrayMinsaPersonal[0]);
        }
        setTimeout(() => {
          this.identificacion.nativeElement.click();
        });
      }
    } catch (error) {
     // console.log(error);
      //this.spinner.hide();
    }
  }

  Seleccionar(data: any) {
    //debugger;
    //console.log('data', data);
    this.showProgress = false;
    let valorCompleto: string = `${data.codigo} - ${data.persona.primernombre} ${data.persona.segundonombre || ''} ${data.persona.primerapellido} ${data.persona.segundoapellido || ''}`;
    this.formulario.reset();
    this.formulario.get('valor').setValue(valorCompleto);
    this.seleccionMinsa.emit(data);

    this.primerNombre = data.persona.primernombre;
    this.SegundoNombre = data.persona.segundonombre;
    this.primerApellido = data.persona.primerapellido;
    this.segundoApellido = data.persona.segundoapellido;
  }

  MostrarCampoNombres() {
    //debugger;
    this.mostrarNombres = true;
    let arrayPalabras = [];
    let cantidadPalabras: number = 0;
    let cadena = this.formulario.get('valor').value;
    if (cadena && cadena.split(' - ').length > 1) {
      arrayPalabras = (cadena.split(' - ')[1]).split(' ');
      cantidadPalabras = arrayPalabras.length;
    } else {
      cantidadPalabras = 1;
    }
    if (cantidadPalabras <= 1) {
      this.resetear = true;
      let valor = cadena;
      this.DatoRequerido(['valor'], false);
      this.DatoRequerido(['primernombre'], true);
      this.DatoRequerido(['segundonombre'], false);
      this.DatoRequerido(['primerapellido'], true);
      this.DatoRequerido(['identificacion'], false);
      this.DatoRequerido(['segundoapellido'], false);
      this.formulario.get('primernombre').patchValue(valor);
    }
    else {
      this.resetear = false;
      this.DatoRequerido(['valor'], false);
      this.DatoRequerido(['primernombre'], true);
      this.DatoRequerido(['segundonombre'], false);
      this.DatoRequerido(['primerapellido'], true);
      this.DatoRequerido(['identificacion'], false);
      this.DatoRequerido(['segundoapellido'], false);

      this.formulario.get('primernombre').patchValue(this.primerNombre);
      this.formulario.get('primerapellido').patchValue(this.primerApellido);
      this.formulario.get('segundonombre').patchValue(this.SegundoNombre);
      this.formulario.get('segundoapellido').patchValue(this.segundoApellido);
    }

    setTimeout(() => {
      this.pApellido.nativeElement.focus();
    });
  }

  DatoRequerido(control: string[], requerido: Boolean) {
    if (requerido) {
      this.formulario.get(control).reset();
      this.formulario.get(control).clearValidators();
      this.formulario.get(control).setValidators(Validators.required);
      this.formulario.get(control).updateValueAndValidity();
    } else {
      this.formulario.get(control).reset();
      this.formulario.get(control).clearValidators();
      this.formulario.get(control).updateValueAndValidity();
    }
  }

  Cancelar() {
    this.mostrarNombres = false;
    this.arrayMinsaPersonal = [];
    this.DatoRequerido(['primernombre'], false);
    this.DatoRequerido(['primerapellido'], false);
    this.DatoRequerido(['identificacion'], true);
    this.formulario.get('valor').patchValue(null);

  }

  BuscarPorNombres() {
    let criterios: any = this.formulario.getRawValue();
    delete criterios.valor;
    delete criterios.identificacion;
    this.ObtenerListaMinsaPersonal(criterios);
  }

  Alertar() {
    this.showProgress = false;
    this.mostrarAlerta = true;
    this.mensaje = 'No se encontro resultado de la busqueda realizada...!';
    setTimeout(() => {
      this.mensaje = '';
      this.mostrarAlerta = false;
    }, 5000);
  }

  ngOnDestroy(): void { }

}

