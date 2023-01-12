import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, ɵConsole } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationDialogPersona } from 'src/app/shared/models/persona/configuration-dialog-persona';
import { SEARCH, CANCEL, NEXT, LOOKUP_NAMES, MOD_DIALOG, RESULT } from '../persona.const';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseBodyRequest, Persona, Paginacion } from 'src/app/shared/models/persona/persona.models';
import { PersonaService } from 'src/app/services/service.index';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-search-lite-persona',
  templateUrl: './dialog-search-lite-persona.component.html',
  styleUrls: ['./dialog-search-lite-persona.component.scss']
})
export class DialogSearchLitePersonaComponent implements OnInit, AfterViewInit, OnDestroy {
  public configurationDialog: ConfigurationDialogPersona;
  public actionRequest: string;
  public search: string = SEARCH;
  public result: string = RESULT;
  public searchForm: FormGroup;
  private subscription$: Subscription;
  public listPersona: Persona[];
  public paginator: Paginacion;
  public parentRequest: string;

  @ViewChild('pApellido', { static: false }) pApellido: ElementRef;

  constructor(private dialogRef: MatDialogRef<DialogSearchLitePersonaComponent>, @Inject(MAT_DIALOG_DATA) data,
    private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private api: PersonaService) {
    this.configurationDialog = data;
    this.initializeForm();
  }

  ngOnInit() {
    if (!this.configurationDialog) { return; }
    switch (this.configurationDialog.actionRequest) {
      case RESULT:
        this.listPersona = this.configurationDialog.personCoincidence;
        break;

      default:
        this.setDataToForm();
        break;
    }
  }

  ngAfterViewInit(): void { }

  initializeForm(): void {
    this.searchForm = this.formBuilder.group({
      typeLookUp: [LOOKUP_NAMES, [Validators.required]],
      identificacion: this.formBuilder.group({
        valor: [null]
      }),
      primerNombre: [null, []],
      segundoNombre: [null, []],
      primerApellido: [null, []],
      segundoApellido: [null, []],
    });
  }

  setDataToForm(): void {
    if (!this.configurationDialog.data) { return; }
    if (!this.configurationDialog.data.datos) { return; }
    this.searchForm.patchValue(this.configurationDialog.data.datos);
    if (this.searchForm.get(['primerNombre']).value) {
      setTimeout(() => {
        this.pApellido.nativeElement.focus();
      }, 500);
    }
    this.searchForm.markAsPristine();
  }

  close(typeClose: string): void {
    if (!typeClose) { return; }
    switch (typeClose) {
      case CANCEL:
        this.dialogRef.close();
        break;
      default:
        this.configurationDialog.actionResult = 'OK';
        this.dialogRef.close(this.configurationDialog);
        break;
    }
  }

  controlHasError(nameValidator: string, frm: FormControl | FormGroup, controlName: string[]): boolean | void {
    if (!controlName) { return; }
    switch (controlName.length) {
      case 0:
        return frm.hasError(nameValidator);
      default:
        if (frm.get(controlName)) {
          return frm.hasError(nameValidator, controlName) && (frm.get(controlName).touched);
        } else { return; }
    }
  }

  findPerson() {
    if (!this.searchForm.valid) { return false; }
    this.spinner.show();
    const criteria: ResponseBodyRequest = { datos: this.searchForm.getRawValue() };
    switch (criteria.datos.typeLookUp) {
      case LOOKUP_NAMES:
        delete criteria.datos.typeLookUp;
        delete criteria.datos.identificacion;
        break;

      default:
        delete criteria.paginacion;
        delete criteria.datos.typeLookUp;
        delete criteria.datos.primerNombre;
        delete criteria.datos.segundoNombre;
        delete criteria.datos.primerApellido;
        delete criteria.datos.segundoApellido;
        break;
    }

    let messageError: string;
    let coincidencias: Persona[];
    let paginacion: Paginacion;
    this.subscription$ = this.api.searchAdvanced(criteria).subscribe({
      next: (r: any) => {
        if (r.data) {
          if (r.paginacion) {
            paginacion = r.paginacion;
            this.paginator = paginacion;
          }
          coincidencias = r.data;
          this.listPersona = coincidencias;
          this.configurationDialog.actionRequest = MOD_DIALOG;
          this.parentRequest = MOD_DIALOG;
        } else { messageError = r; }
      },
      error: (e: HttpErrorResponse) => messageError = e.message,
      complete: () => {
        this.spinner.hide();
        if (coincidencias) {
          // this.result.emit(coincidencias);
          if (paginacion) {
            if (paginacion.paginasPendientes >= 0) {
              // this.paginacion.emit(paginacion);
              this.api.criteriaLookUp$.next(criteria);
            }
            // this.paginacion.emit(paginacion);
          } else { this.api.criteriaLookUp$.next(null); }
        } else {
          // this.assignErrorForDialog(messageError);
        }
      }
    });
  }

  rowSelected(personSelected: Persona) {
    if (!personSelected) { return; }
    if (!this.configurationDialog.configLimitPerson) {
      this.setPersonSelected(personSelected);
      return;
    }
    if (this.validConditionsPerson(personSelected)) {
      this.setPersonSelected(personSelected);
    }
  }

  private setPersonSelected(personSelected: Persona): void {
    this.configurationDialog.data.personSelected = personSelected;
    this.configurationDialog.actionResult = 'OK';
    this.close(NEXT);
  }

  private validConditionsPerson(personSelected: Persona): boolean {
    if (this.configurationDialog.configLimitPerson.justLimitIdentificada) {
      if (!personSelected.identificada) {
        Swal.fire('Tipo de persona inválida',
          'No puedes asociar este registro ya que no es un registro, válido',
          'warning');
        return false;
      }
    }

    if (this.configurationDialog.configLimitPerson.justLimitNoIdentificada) {
      if (personSelected.identificada) {
        Swal.fire('Tipo de persona inválida',
          'No puedes asociar este registro ya que no es un registro, válido',
          'warning');
        return false;
      }
    }

    if (this.configurationDialog.configLimitPerson.limitAge) {
      if (personSelected.edad) {
        if (this.configurationDialog.configLimitPerson.minAge) {
          if (Number(personSelected.edad.anios) < this.configurationDialog.configLimitPerson.minAge) {
            Swal.fire('Edad de la persona, inválida',
              'El registro de persona, no cumple con la edad mínima de ' +
              this.configurationDialog.configLimitPerson.minAge
              + ' años',
              'warning');
            return false;
          }
        }
        if (this.configurationDialog.configLimitPerson.maxAge) {
          if (Number(personSelected.edad.anios) > this.configurationDialog.configLimitPerson.maxAge) {
            Swal.fire('Edad de la persona, inválida',
              'El registro de persona, no cumple con la edad máxima de ' +
              this.configurationDialog.configLimitPerson.maxAge
              + ' años',
              'warning');
            return false;
          }
        }
      } else {
        Swal.fire('Edad de la persona incompleta',
          'Se requiera la edad de la persona, y el registro no tiene dicha información',
          'warning');
        return false;
      }
    }
    return true;
  }


  ngOnDestroy(): void {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

}
