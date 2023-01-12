import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { EXP_TKN, JWT, SYSTEM, USER } from 'src/app/services/constantes';
import { LoginService, MenuService } from 'src/app/services/service.index';
import { Relmenurecursodto } from 'src/app/shared/models/menu-dto/relmenurecursodto';

@Component({
  selector: 'app-sidebarpropuesta',
  templateUrl: './sidebarpropuesta.component.html',
  styleUrls: ['./sidebarpropuesta.component.scss'],
})
export class SidebarpropuestaComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input('show') show: boolean = false;

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;

  public menu: Relmenurecursodto[] = [];
  private subscripcion: Subscription;
  private _onDestroy = new Subject<void>();
  constructor(
    private menuService: MenuService,
    private seguridadService: LoginService
  ) {
    if (this.seguridadService.getLocalStorageItem(EXP_TKN)) {
      if (this.seguridadService.tokenIsValid()) {
        this.show = true;
        this.setMenu();
      }
    }
    // this.subscripcion = this.menuService.menus.pipe(takeUntil(this._onDestroy))
    // .subscribe(result => {
    //   this.menu = result;
    //   console.log('menu subscrito', this.menu);
    // });
  }
  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    // this.menuService.menus.subscribe(resp=> console.log('menu_desde_OnDestroy>>', resp));
  }
  ngAfterViewInit(): void {
    this.menuService.appDrawer = this.appDrawer;
  }

  ngOnInit() {
    /*this.subscripcion = this.menuService.menus.pipe(takeUntil(this._onDestroy))
      .subscribe(result => {
        this.menu = result;
        console.log('menu subscrito desde sidebar', this.menu);
      });*/
  }

  getExpirationToken(): void {
    if (!this.seguridadService.getLocalStorageItem(EXP_TKN)) {
      this.seguridadService
        .getTokenExpiration(this.seguridadService.getLocalStorageItem(JWT))
        .subscribe({
          next: (v) => {
            if (v.token) {
              delete v.token;
            }
            this.seguridadService.setLocalStorage(EXP_TKN, v);
          },
          error: (e: HttpErrorResponse) => console.log('error ', e.message),
          complete: () => {},
        });
    }
  }

  setMenu(): void {
    if (
      this.seguridadService.getLocalStorageItem(JWT) &&
      this.seguridadService.getLocalStorageItem(USER) &&
      this.seguridadService.getLocalStorageItem(SYSTEM)
    ) {
      const user = this.seguridadService.getLocalStorageItem(USER).id;
      const sistema = this.seguridadService.getLocalStorageItem(SYSTEM).id;
      this.menuService.cargarMenu(user, sistema).subscribe((resp) => {
        this.menu = resp.data[0].sistema.menu;
        // this.seguridadService.setLocalStorage('userRol', this.menu);
      });
    }
  }
}
