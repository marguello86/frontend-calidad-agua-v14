import { Injectable } from '@angular/core';
import { LocalStorageAdminService } from '../local-storage-admin.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Relmenurecursodto } from 'src/app/shared/models/menu-dto/relmenurecursodto';
import { DataMenuRolAccion } from 'src/app/shared/models/rol/menu-rol-accion';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends LocalStorageAdminService {
  private url: string = environment.urlSeguridad;
  private menu: Relmenurecursodto[] = [];
  private menus$ = new BehaviorSubject<any[]>([]);
  private menusRolAccion$ = new BehaviorSubject<DataMenuRolAccion>(null);
  private childrenEliminar: Relmenurecursodto[];
  public appDrawer: any;
  constructor(private http: HttpClient) {
    super();
  }

  cargarMenu(idUsuario: number, idSistema: number): Observable<any> {
    return this.http
      .get(`${this.url}gestion-menus/permisos/menu/${idUsuario}/${idSistema}`)
      .pipe(
        map((response: any) => {
          this.menu = response.data[0].sistema.menu;
          this.menu = this.menu.filter((m) => !m.pasivo);
          this.ConstruirMenu(this.menu);
          this.menu = this.omitChildGone(this.menu);
          response.data[0].sistema.menu = this.menu;
          //console.log(this.menu);
          this.menus$.next(this.menu);
          //debugger
          this.SetMenuRolAccion(response.data[0]);
          return response;
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  ConstruirMenu(menu: Relmenurecursodto[]) {
    // let childrenEliminar: Relmenurecursodto[];
    menu.forEach((_menu) => {
      const childrens: Relmenurecursodto[] = menu.filter(
        (x) => x.dependencia === _menu.id
      );
      if (childrens.length > 0) {
        // childrens.forEach(_items =>
        //   {
        //     console.log('child', _items);
        //     this.childrenEliminar.push(_items);
        //   });

        this.childrenEliminar = childrens;
        _menu.childrens = childrens;
        // console.log('Primeros hijos a eliminar', this.childrenEliminar );
        this.PoblarArbol(_menu.childrens, menu, this.childrenEliminar);
      }
    });
    //  this.EliminaDuplicados(menu, this.childrenEliminar );
  }

  omitChildGone(menu: Relmenurecursodto[]): Relmenurecursodto[] {
    return menu.filter((m) => {
      if (m.dependencia === 0) {
        if (
          (m.recurso.url === 'null' && m.childrens) ||
          m.recurso.url !== 'null'
        ) {
          return m;
        } else {
          return;
        }
      }
    });
  }

  PoblarArbol(
    childrens: Relmenurecursodto[],
    menu: Relmenurecursodto[],
    childrenEliminar: Relmenurecursodto[]
  ) {
    childrens.forEach((item) => {
      // const child: Relmenurecursodto[] = menu.filter(x => x.dependencia === item.id);
      if (childrenEliminar.length > 0) {
        this.EliminaDuplicados(menu, this.childrenEliminar);
      }
      const child: Relmenurecursodto[] = menu.filter(
        (x) => x.dependencia === item.id
      );
      if (child.length > 0) {
        child.forEach((x) => {
          //  console.log('Agregando hijo a eliminar', x);
          childrenEliminar.push(x);
        });
        item.childrens = child;
        //  console.log('item.childrens', item.childrens);
        this.PoblarArbol(item.childrens, menu, childrenEliminar);
      }
    });
  }
  EliminaDuplicados(
    menu: Relmenurecursodto[],
    childrenEliminar: Relmenurecursodto[]
  ) {
    // console.log('total_menu', menu);
    // console.log('hijos_eliminar', childrenEliminar);
    // console.log('mapMenu Before -> ', menu);
    // console.log('mapMenu After -> ', menu);
    childrenEliminar.forEach((x) => {
      // console.log('item of Menu ->> ', x);
      const index = menu.indexOf(x, 0);
      if (index > -1) {
        menu.splice(index, 1);
      }
    });
    // console.log('Nuevo this.menu', menu);
  }
  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
  getMenu(): Observable<any> {
    return this.menus$.asObservable();
  }
  clearMenu(): void {
    this.menus$.next(null);
  }

  SetMenuRolAccion(info: DataMenuRolAccion): void {
    //debugger;
    this.setLocalStorage('userRol', info);
    return this.menusRolAccion$.next(info);
  }

  ObtenerMenuRolAccion(): DataMenuRolAccion {
    //debugger;
    let data: DataMenuRolAccion = {};
    this.menusRolAccion$.subscribe((d) => {
      //debugger;
      if (d) {
        data = d;
      }
    });
    return data;
  }
}
