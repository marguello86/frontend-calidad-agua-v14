import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit, Component, Input, OnDestroy, OnInit, HostListener,
  EventEmitter, Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
//import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersonaService } from 'src/app/services/service.index';
import { DataRequest, Paginacion, Persona, ResponseBodyRequest } from 'src/app/shared/models/persona/persona.models';
import { CT_SEXO_F, CT_SEXO_M, ROWS_PER_PAGE_API, MOD_PRS } from '../persona.const';

@Component({
  selector: 'app-list-personas',
  templateUrl: './list-personas.component.html',
  styleUrls: ['./list-personas.component.scss']
})
export class ListPersonasComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('data') data: any[];
  @Input('paginacion') paginacion: Paginacion;
  @Input('criteria') criteria: DataRequest;
  @Input('typeParent') typeParent: string = MOD_PRS;
  @Output('closeParent') closeParent: EventEmitter<Persona[]> = new EventEmitter();

  public classPersonItem: string = 'col animated slideInRight';
  public avatarProfileF: string = 'assets/images/patientAvatarProfileF.png';
  public avatarProfileM: string = 'assets/images/patientAvatarProfileM.png';
  public avatarProfileU: string = 'assets/images/patientAvatarProfileU.png';
  public length: number = 100;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 20];
  public dataActivePage: Persona[];
  private criteriaLookUp: ResponseBodyRequest;
  private subject$: Subject<void> = new Subject();
  private subscription$: Subscription;

  private mPaginas = new Map<number, Persona[]>();

  public isShow: boolean;
  private topPosToStartShowing = 100;

  constructor(private router: Router, private api: PersonaService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (this.data) {
      this.dataActivePage = this.data;
      if (this.paginacion) {
        this.dataActivePage = this.data.slice(0, this.pageSize);
        this.api.criteriaLookUp$.pipe(takeUntil(this.subject$)).subscribe(c => {
          if (c) {
            this.criteriaLookUp = c;
            this.mPaginas.set(0, this.data);
          } else { this.criteriaLookUp = null; this.paginacion = null; }
        });
      } else {
        // this.dataActivePage = this.data.slice(0, this.pageSize);
      }
    }
  }

  ngAfterViewInit(): void { }


  getAvatarProfile(code: string): string {
    switch (code) {
      case CT_SEXO_F: return this.avatarProfileF;
      case CT_SEXO_M: return this.avatarProfileM;
      default: return this.avatarProfileU;

    }
  }

  getClassFromSexCode(code: string, component: string): any {
    switch (component) {
      case 'title':
        return code === CT_SEXO_F ? 'femenino' : 'masculino';
      case 'content':
        return code === CT_SEXO_F ? 'femenino-content' : 'masculino-content';
    }

  }

  ir(personaSelected: any): void {
    this.api.setPersonSelected(personaSelected);
    if (this.typeParent === MOD_PRS) {
      this.router.navigate(['/captacion/agregar']);
      return;
    }
    this.closeParent.emit(personaSelected);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  pageChangeEvent(event: PageEvent): void {
    this.setClassDynamic(event.pageIndex, event.previousPageIndex);
    const totalRowsByPagePagination: number = ROWS_PER_PAGE_API;
    let iStart: number = 0;
    let iEnd: number = iStart + event.pageSize - 1;
    let iPageGlobal: number = 0;
    if (event.pageIndex * event.pageSize >= totalRowsByPagePagination) {
      const calcPage: number = event.pageIndex * event.pageSize / totalRowsByPagePagination;
      if (!Number.isInteger(calcPage)) {
        const decimalPage: number = Number(String(calcPage).substring(String(calcPage).indexOf('.') + 1));
        iPageGlobal = Math.trunc(calcPage);
        iStart = decimalPage * event.pageSize;
        iEnd = iStart + event.pageSize - 1;
      } else {
        iPageGlobal = calcPage;
      }
    } else {
      if (event.pageIndex > 0) {
        iStart = event.pageIndex * event.pageSize;
        iEnd = iStart + event.pageSize - 1;
      }
    }
    this.getDataDynamicByPagination(iPageGlobal, iStart, iEnd + 1, this.data);
  }

  getDataDynamicByPagination(idxPageGlobal: number, startRow: number, endRow: number, data: Persona[]): void {
    this.data = [];
    switch (idxPageGlobal) {
      case 0:
        Object.assign(this.data, this.lookUpKeyOnMap(0));
        this.dataActivePage = this.data.slice(startRow, endRow);
        break;
      default:
        idxPageGlobal += 1;
        if (!this.lookUpKeyOnMap(idxPageGlobal)) {
          this.criteriaLookUp.paginacion = {
            pagina: idxPageGlobal,
            paginaRegistros: ROWS_PER_PAGE_API
          };
          this.getDateOfApi(startRow, endRow);
        } else {
          Object.assign(this.data, this.lookUpKeyOnMap(idxPageGlobal));
          this.dataActivePage = this.data.slice(startRow, endRow);
        }
        break;
    }
  }

  lookUpKeyOnMap(key: number): Persona[] {
    return this.mPaginas.get(key);
  }

  setClassDynamic(idxXurrent: number, idxPrev: number): void {
    if (idxXurrent > idxPrev) {
      this.classPersonItem = 'col animated slideInRight';
    } else {
      this.classPersonItem = 'col animated slideInLeft';
    }
  }

  getDateOfApi(start: number, end: number): void {
    this.spinner.show();
    let newList: Persona[];
    this.subscription$ = this.api.searchAdvanced(this.criteriaLookUp).subscribe({
      next:
        p => { if (p.data) { newList = p.data; } },
      error: (e: HttpErrorResponse) => { console.log(e); },
      complete: () => {
        this.spinner.hide();
        this.mPaginas.set(this.criteriaLookUp.paginacion.pagina, newList);
        this.data = [];
        Object.assign(this.data, this.lookUpKeyOnMap(this.criteriaLookUp.paginacion.pagina));
        this.dataActivePage = this.data.slice(start, end);
      }
    });
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  gotoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
    this.subject$.next();
    this.subject$.complete();
  }

}
