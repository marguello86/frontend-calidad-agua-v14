import Swal from 'sweetalert2'

import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { TPO_FND_CT } from '../catalogos.const';
import { SbcCatColectivosService } from 'src/app/services/catalogos/sbc-cat-colectivos.service';


declare var $: any;

@Component({
  selector: 'sbc-cat-colectivos-combo',
  templateUrl: './sbc-cat-colectivos-combo.component.html',
  styleUrls: ['./sbc-cat-colectivos-combo.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => SbcCatColectivosComboComponent), }]
})
export class SbcCatColectivosComboComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private readonly _classTag = 'combo-cat-colectivos';
  private _onDestroy = new Subject<void>();
  private _disabled = false;
  @ViewChild('ngxMat', {static: false}) ngxMat : ElementRef;
  @Input() valor: string;
  @Input() tipo: string;
  @Input() prefijo: string;
  @Input() entidad: string;
  @Input() referencia: string;
  @Input() esquema: string = 'catalogos';
  @Input() permitidos: string;
  @Input() hideFilter = false;
  @Input() required = false;
  @Input() autoSelectFirts = false;
  @Input() datos: Array<any>;
  @Input() multiple: false;
  @Input() showPasive: boolean = false; // Este indicador al ser true; no discrimina a los pasivos
  @Input() selectCtrl: FormControl = new FormControl({ value: '', disabled: this._disabled });
  @Input() datosSeleccionados: Array<any> = null;

  @Input() codigoDefault: string = ''; //se establece un codigo para pintar valor por default del comb

  /* ControlValueAccessor ini */
  private _onChange: (_: any) => void;
  private _onTouched: () => void;

  private _value: any;
  /* ControlValueAccessor end */

  // selectCtrl: FormControl = new FormControl({ value: '', disabled: this._disabled });
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



  private maxItems: number = 50;
  private lastItemsCount: number = 50;
  private lastFilterText: string;

  showProgress = false;
  itemId: any;
  private obs: Observable<any>;
  error: string;

  private dataSbsc: Subscription;
  private filterCtrlSbsc: Subscription;
  private tpoLookUpCat: string;
  public valorColectivo: boolean = false;

  myObserver = {
    next: (x: any) => this.dataSbs(x),
    error: (err: any) => { console.error('Observer got an error: ' + err); },
    complete: () => { console.log('Observer got a complete notification'); }
  };

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private apiSbc: SbcCatColectivosService,
  ) {
    this.tpoLookUpCat = TPO_FND_CT;
    if (this.required) {
      this.selectCtrl.setValidators([Validators.required]);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (isDisabled) {
      this.selectCtrl.disable();
    } else { this.selectCtrl.enable(); }
  }

  private get api(): any {
    switch (this.esquema) {
      case 'catalogos':
        return this.apiSbc;

      case 'hospitalario':
        return null;

      case 'programas':
        break;
    }
  }

  get placeholderSearch(): string {
    if (this.lastFilterText) {
      return `Filtrado de: ${this.lastFilterText}`;
    } else if (this.datos && this.datos.length > this.maxItems) {
      const dt: string = this.datos.length.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00', '');
      return `Mostrando ${this.lastItemsCount} de ${dt} registros... Busque para seleccionar...`;
    } else {
      return `Buscar...`;
    }
  }

  onChange = (_: any) => {
    if (this._onChange) { this._onChange(_); }
  }
  onTouched = () => {
    if (this._onChange) { this._onTouched(); }
  }

  writeValue(value: any[]): void {
    if (this.value !== value) {
      this.value = value;
      this.onChange(this.value);
    }

    if (!this.datos) { return; }

    let lItemId: any = null;


    let lItemIds: any[] = new Array<any>();
    if (value === null) {
      lItemId = null;
      if (this.codigoDefault) {
        lItemId = this.datos.filter(item => item.codigo === this.codigoDefault)[0];
      }
    }
    // else if (this.datos && this.multiple && values) {

    // }

    else if  (this.datos && +value > 0 && !this.multiple) {
      lItemId = this.datos.filter(item => item.id === +value)[0];
    } else if (this.datos && value.length > 0 && this.multiple) {
      value.forEach(val => {
        lItemId = this.datos.filter(item => item.id === +val)[0];
        lItemIds.push(lItemId);
      });
    }

    if (!this.multiple) {
      if (this.itemId !== lItemId) {
         this.selectCtrl.setValue(lItemId);
         this.onItemSelected.emit(lItemId);
       }
    } else {
      if (this.itemId !== lItemIds) {
         this.selectCtrl.setValue(lItemIds);
         this.onItemSelected.emit(lItemIds);
       }
    }

    /************************************************* */


  }
  registerOnChange(fn: (_: any) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }

  ngOnInit() {
    if (this.datosSeleccionados) {
      this.value = this.datosSeleccionados;
      this.writeValue(this.datosSeleccionados);
    }
    if (this.datos) { this.cargarDatos(); return; }
    this.showProgress = true;
    this.obs = (this.tipo === this.tpoLookUpCat ?
      this.api.obtenerPorCodigoSuperior(this.valor) :
      this.api.obtenerPorIdSuperior(Number.parseInt(this.valor)));
    this.dataSbsc = this.obs.pipe(finalize(() => { this.showProgress = false; })).subscribe({
      next: (value) => this.dataSbs(value),
      error: (error) => {
        this.error = (error.message || error.error);
      }, 
      complete:() => {
        this.showProgress = false;
      }
    }

    );
  }

  private dataSbs(value: any) {
    if (value === null) { return; }
    this.datos = $.extend(true, [], value.datos || value.data);
    this.datos = this.datos[0]['childrens'];
    this.datos.sort((a, b) => this.compare(a.orden, b.orden, true));
    this.datos = this.showPasive === false ? this.datos.filter((d) => {
      if (d.pasivo !== null || d.pasivo !== undefined) { return d.pasivo === false; }
    }) : this.datos;
    if (this.datos.length < 1) {
      this.datos = null;
      this.error = (value.error ? value.error.mensaje || value.error : 'No se retornaron datos');
      return;
    }
    this.cargarDatos();
  }
  compare(a: number | string | Date, b: number | string | Date, isAsc?: boolean) {
    return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
  }

  private cargarDatos() {
    if (this.datos && this.datos.length > this.maxItems) {
      this.hideFilter = false;
    }
    this.datos.forEach((val: any) => {
     // console.log('val inyectado', val);
      val.id = (val.id || val.catalogoId || val[`${this.prefijo}Id`]);
      val.nombre = (val.nombre || val.catalogoNombre || val.nombre || val[`${this.prefijo}Nombre`]);
    });
    if (this.permitidos) {
      const check = ',' + this.permitidos.toLowerCase() + ',';
      const fdt = this.datos.filter((item) => {
        return check.indexOf(',' + (item.codigo || item.valor || '').toLowerCase() + ',') >= 0;
      });
      this.datos = fdt;
     // console.log('this.datos', this.datos);
    }
   // this.datos.sort((a, b) => this.compare(a.valor, b.valor, true));
    this.datos.map(e => { if (e.valor) { e.valor = e.valor.toUpperCase(); } return e; });
    const tdt = this.datos.slice(-this.maxItems);
  //  console.log('tdt en cargar datos', tdt);
    this.filteredItems.next(tdt);
    this.filterCtrlSbsc = this.filterCtrl.valueChanges
      .pipe(debounceTime(1), distinctUntilChanged(), takeUntil(this._onDestroy))
      .subscribe((data) => {
      //  console.log('data en this.filterCtrlSbsc', data);
        this.filterData();
      });
    if (!this.multiple) {
        this.selectCtrl.valueChanges.subscribe((data) => {
          const lid = (data === null ? null : data.id);
         // console.log('lid', lid);
          if (this.value !== lid) {
            this.value = lid;
            this.valorColectivo = this.value ? true : false;
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
            this.selectCtrl.setValue(this.datos[0]);
          } else {
            this.writeValue(null);
          }
        }
     }

   /* this.selectCtrl.valueChanges.subscribe((data) => {
      console.log('cambios en cargar data', data);
      console.log('this.value', this.value);
      const lid = (data === null ? null : data.id);
      console.log('lid', lid);
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
        this.selectCtrl.setValue(this.datos[0]);
      } else {
        this.writeValue(null);
      }
    } */

    if (this.multiple) {
      this.selectCtrl.valueChanges.subscribe((data: any []) => {
       let lid = new Array<number>();
      //   console.log('lid', lid);
       if (data) {
         data.forEach(x => {
            let ids: number = x.id;
           // console.log('ids', ids);
            lid.push(ids);
          });
       //  console.log('Nuevo lid', lid);
        }
     //   console.log('lid', lid);
       if (this.value !== lid) {
         // console.log('entre al this.value !== lid', lid);
          this.value = lid;
          if (this.value) {
            this.onChange(this.value);
            this.onItemSelected.emit(data);
          }
        }
      });
      if (this.value && this.value.length > 0) {
      //  console.log('this.value && this.value.length > 0', this.value && this.value.length > 0);
        this.writeValue(this.value);
      } else {
        if (this.autoSelectFirts) {
          this.selectCtrl.setValue(this.datos[0]);
        } else {
          this.writeValue(null);
        }
      }
    }
  }

  private filterData() {
    if (!this.datos) { return; }
    let search = this.filterCtrl.value;
  //  console.log('this.lastFilterText', this.lastFilterText);
    if (!search) {
      this.lastFilterText = search;
      const dt = this.datos.slice(/*-this.maxItems*/);
      if (this.selectCtrl.value) {
        const ids = this.multiple ? this.selectCtrl.value[0].id : this.selectCtrl.value.id;
        let ac = dt.filter(item => { item.id === ids; });
     //   console.log('ac', ac);
       // if (!ac || ac.length === 0) {ac = this.datos.filter(item => item.id === ids)[0]; }
      //  dt.unshift(ac);
      }
      this.lastItemsCount = dt.length;
      this.filteredItems.next(dt);
      return;
    }
    this.lastFilterText = search;
    search = search.toLowerCase().replace(/\s+/g, ' ');
    const check = search.split(' ');
  //  console.log('check', check);
    const fdt = this.datos.filter((item) => {
     //  for (let i = 0; i < check.length; i++) {
     return  (item.nombre || item.valor || item.descripcion || item.nombreCompleto).toLowerCase().indexOf(search) > -1;
       /* if (( */ //item.nombre || item.valor || item.descripcion || item.nombreCompleto).toLowerCase().indexOf(check[i]) > -1) //{
         // console.log('check[i]', check[i]);
        // return false;
      //  }
      //  console.log('check[i]', check[i]);
       // console.log('[i]', i);
    //  }
      // for (let i = 0; i < check.length; i++) {
      //   if ((item.nombre || item.valor || item.descripcion || item.nombreCompleto).toLowerCase().indexOf(check[i]) === -1) {
      //     console.log('check[i]', check[i]);
      //     return false;
      //   }
      //   console.log('check[i]', check[i]);
      //   console.log('[i]', i);
      // }
    //  return true;
    });
   // console.log('fdt', fdt);
  //  console.log('ngxMat: ', this.ngxMat);
   // if (fdt.length > 0) {
      this.lastItemsCount = fdt.length;
      this.filteredItems.next(fdt);
   // }
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
  LimpiarControl() {
    this.selectCtrl.patchValue(null);
  }


}
