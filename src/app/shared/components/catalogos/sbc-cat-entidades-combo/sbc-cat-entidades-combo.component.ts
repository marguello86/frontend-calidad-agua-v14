import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { SbcCatEntidadesService } from 'src/app/services/catalogos/sbc-cat-entidades.service';
import Swal from 'sweetalert2';
import { SnhCatHospitalarioService } from 'src/app/services/catalogos/snh-cat-hospitalario.service';
import { SnhCatPacientesService } from 'src/app/services/catalogos/snh-cat-pacientes.service';
import { SbcCatEntidadesprotectedService } from 'src/app/services/service.index';

declare var $: any;

@Component({
  selector: 'sbc-cat-entidades-combo',
  templateUrl: './sbc-cat-entidades-combo.component.html',
  styleUrls: ['./sbc-cat-entidades-combo.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => SbcCatEntidadesComboComponent), }]
})
export class SbcCatEntidadesComboComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private readonly _classTag = 'combo-cat-entidades';


  private _disabled = false;
  private obs: Observable<any>;
  private dataSbsc: Subscription;
  // private dataSbsc1: Subscription;
  private filterCtrlSbsc: Subscription;
  private _onDestroy = new Subject<void>();

  private _value: any;
  private maxItems: number = 3000;
  private lastItemsCount: number = 50;
  private lastFilterText: string;

  @Input() nullable = false;
  @Input() valor: string;
  @Input() tipo: string; // Cuerpo del endpoint a consultar; penúltimo string del endpoint
  @Input() prefijo: string;
  @Input() entidad: string; // Etiqueta (label) del componente
  @Input() referencia: string; // Se define el combo padre en caso de tenerlo
  @Input() esquema: string = 'catalogos'; // Tipo Api a usar [Catalogos - Hospitalario]
  @Input() hideFilter = false; // Habilita desahabilita mostrar la caja de filtro
  @Input() required = false; // Define la validación si el combo es requerido o no
  @Input() autoSelectFirts = false; // Pre-seleccionar el primer registro
  @Input() selectCtrl: FormControl = new FormControl({ value: '', disabled: this._disabled });
  @Input() datos: Array<any>;
  @Input() showPasive: boolean = false; // Este indicador al ser true; no discrimina a los pasivos
  @Input() isDisabled = false;
  @Output() isError = new EventEmitter<any>();



  filterCtrl: FormControl = new FormControl();
  filteredItems: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(val: boolean) {
    this._disabled = val;
    if (val) { this.selectCtrl.disable(); } else { this.selectCtrl.enable(); }
  }
  @Input()
  get value(): any { return this._value; }
  set value(val: any) { this._value = val; }


  @Output() onItemSelected = new EventEmitter();

  get placeholderSearch(): string {
    if (this.lastFilterText) {
      return `Filtrado de: ${this.lastFilterText}`;
    } else if (this.datos && this.datos.length > this.maxItems) {
      const dt: string = this.datos.length.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00', '');
      return `Mostrando ${this.lastItemsCount} de ${dt}. Busque para seleccionar...`;
    } else {
      return `Buscar...`;
    }
  }

  private get api(): any {
    switch (this.esquema) {
      case 'catalogos':
        return this.apiSbc;
      case 'pacientes':
        return this.apiPx;
      case 'hospitalario':
        return this.apiHsp;
      case 'hospitalario-caracteristica':
        return this.apiHsp;
      case 'seguridad-silais':
        return this.apiSeguridad;
    }

  }

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private apiSbc: SbcCatEntidadesService,
    private apiPx: SnhCatPacientesService,
    private apiHsp: SnhCatHospitalarioService,
    private apiSeguridad: SbcCatEntidadesprotectedService
  ) {
    if (this.required) {
      this.selectCtrl.setValidators([Validators.required]);
    }
    // console.log('this.datos en el constructor', this.datos);
  }


  /* ControlValueAccessor ini */
  private _onChange: (_: any) => void;
  private _onTouched: () => void;
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (isDisabled) {
      this.selectCtrl.disable();
    } else { this.selectCtrl.enable(); }
  }
  /* ControlValueAccessor end */
  showProgress = false;

  itemId: any;

  error: string;


  myObserver = {
    next: (x: any) => this.dataSbs(x),
    error: (err: any) => { console.error('Observer got an error: ' + err); },
    complete: () => { console.log('Observer got a complete notification'); },
  };


  onChange = (_: any) => {
    if (this._onChange) { this._onChange(_); }
  }

  onTouched = () => {
    if (this._onChange) { this._onTouched(); }
  }
  writeValue(value: any): void {
    // if (value === null) { return; }
    // console.log('value', value);
    if (this.value !== value) {
      // console.log(' dentro de this.value !== value');
      //  console.log('+value: ', +value);
      this.value = value;
      this.onChange(this.value);
    }
    if (!this.datos) { return; }
    let lItemId: any = null;
    if (value === null) {
      lItemId = null;
    } else if (this.datos && +value > 0) {
      lItemId = this.datos.filter(item => item.id === +value)[0];
    }
    if (this.itemId !== lItemId) {
      this.selectCtrl.setValue(lItemId);
      this.onItemSelected.emit(lItemId);
    }
  }
  registerOnChange(fn: (_: any) => void): void { this._onChange = fn; /* console.log('registrando cambios') */ }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }

  ngOnInit() {
    if (this.datos) { this.cargarDatos(); return; }
    if (!this.valor && !this.nullable) { return; }
    this.showProgress = true;
    this.seleccionaApiEsquema();
    this.dataSbsc = this.obs.pipe(finalize(() => { this.showProgress = false; })).subscribe(
      (value) => this.dataSbs(value),
      (error) => {
        this.error = (error.message || error.error);
      }, () => {
        this.showProgress = false;
      }
    );
  }

  seleccionaApiEsquema(): void {
    switch (this.esquema) {
      case 'catalogos':
        this.obs = (this.referencia ?
          this.api.obtenerPorReferenciaId(this.tipo, this.referencia, this.valor) :
          this.api.obtenerPorId(this.tipo, this.valor));
        break;

      case 'pacientes':
        this.obs = (this.referencia ?
          this.api.obtenerPorReferenciaId(this.tipo, this.referencia, this.valor) :
          this.api.obtenerPorId(this.tipo, this.valor));
        break;
      case 'hospitalario':
        this.obs = (this.api.obtenerPorId(this.tipo, this.valor));
        break;
      case 'hospitalario-caracteristica':
        this.obs = (this.api.obtenerPorCodigo(this.tipo, this.valor));
        break;
      case 'seguridad-silais':
        this.obs = (this.referencia ?
          this.api.obtenerPorReferenciaId(this.tipo, this.referencia, this.valor) :
          this.api.obtenerSilais(this.tipo));
        break;
    }
  }

  actualizarPorReferencia(refNm: string, refVal: any): void {
    if (this.dataSbsc) { this.dataSbsc.unsubscribe(); }
    if (this.filterCtrlSbsc) { this.filterCtrlSbsc.unsubscribe(); }
    this.referencia = refNm;
    this.valor = refVal;
    this.datos = null;
    this.error = null;
    if (+refVal > 0) {
      this.showProgress = true;
      this.seleccionaApiEsquema();
      this.dataSbsc = this.obs.pipe(finalize(() => { this.showProgress = false; })).subscribe(
        (value) => this.dataSbs(value),
        (error) => {
          this.error = (error.message || error.error);
        }, () => {
          this.showProgress = false;
        }
      );
    } else {
      this.showProgress = false;
    }
    this._changeDetector.detectChanges();
  }

  private dataSbs(value: any) {
    if (value === null) { return; }
    if (this.esquema === 'hospitalario-caracteristica') {
      this.datos = $.extend(true, [], value.data[0].childrens || value.datos || value.data);
    }
    if (this.esquema === 'seguridad-silais') {
      if (!value.data || !value.datos) {
        this.isError.emit(value.error);
        // return;
      }
      this.datos = $.extend(true, [], value.data[0].unidades || value.datos || value.data);
    } else {
      this.datos = $.extend(true, [], value.datos || value.data);
    }
    if (this.datos.length < 1) {
      this.datos = null;
      this.error = (value.error ? value.error.mensaje || value.error : 'No se retornaron datos');
      return;
    }
    this.cargarDatos();
  }

  private cargarDatos() {
    // console.log('cargando datos;', this.datos);
    if (this.datos && this.datos.length > this.maxItems) {
      this.hideFilter = false;
    }
    this.datos = this.showPasive === false ? this.datos.filter((d) => {
      if (d.pasivo !== null || d.pasivo !== undefined) { return d.pasivo === false; }
    }) : this.datos;
    this.datos.forEach((val: any) => {
      val.id = (val.id || val.catalogoId || val[`${this.prefijo}Id`] || val[`${this.prefijo}Id`.toLowerCase()]);
      val.nombre = (val.nombre || val.catalogoNombre || val[`${this.prefijo}Nombre`]);
    });
    this.datos.sort((a, b) => a.nombre > b.nombre ? 1 : a.nombre < b.nombre ? -1 : 0);
    this.datos.map(e => { e.nombre = e.nombre.toUpperCase(); return e; });
    const tdt = this.datos.slice(0, this.maxItems);
    this.filteredItems.next(tdt);
    this.filterCtrlSbsc = this.filterCtrl.valueChanges
      .pipe(debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterData();
      });
    this.selectCtrl.valueChanges.subscribe((data) => {
      // console.log('cambios en control', data);
      const lid = (data === null ? null : data.id);
      if (this.value !== lid) {
        this.value = lid;
        if (this.value) {
          this.onChange(this.value);
          this.onItemSelected.emit(data);
        }
      }
    });
    if (this.value && +this.value > 0) {
      this.writeValue(this.value);
    } else {
      if (this.autoSelectFirts) {
        // this.writeValue(this.datos[0].id);
        this.selectCtrl.setValue(this.datos[0]);
      } else {
        this.writeValue(null);
      }
    }
  }

  private filterData() {
    if (!this.datos) { return; }
    let search = this.filterCtrl.value;
    if (!search) {
      this.lastFilterText = search;
      const dt = this.datos.slice(-this.maxItems);
      if (this.selectCtrl.value) {
        const ids = this.selectCtrl.value.id;
        let ac = dt.filter(item => item.id === ids)[0];
        if (!ac) {
          ac = this.datos.filter(item => item.id === ids)[0];
          dt.unshift(ac);
        }
      }
      this.lastItemsCount = dt.length;
      this.filteredItems.next(dt);
      return;
    }
    this.lastFilterText = search;
    search = search.toLowerCase().replace(/\s+/g, ' ');
    const check = search.split(' ');
    const fdt = this.datos.filter((item) => {
      for (let i = 0; i < check.length; i++) {
        if ((item.nombre || item.valor || item.descripcion || item.nombreCompleto)
          .toLowerCase().indexOf(check[i]) === -1) {
          return false;
        }
      }
      return true;
    });
    this.lastItemsCount = fdt.length;
    this.filteredItems.next(fdt);
  }

  showErrorDetail() {
    Swal.fire(this.error, 'Detalle de error de carga', 'error');
  }

  ngOnDestroy() {
    if (this.dataSbsc) { this.dataSbsc.unsubscribe(); }
    if (this.filterCtrlSbsc) { this.filterCtrlSbsc.unsubscribe(); }
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
