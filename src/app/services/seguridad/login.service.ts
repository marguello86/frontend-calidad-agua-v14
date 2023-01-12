import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PasswordConfirmComponent } from 'src/app/shared/components/utility/password-confirm/password-confirm.component';
import { environment } from 'src/environments/environment';
import { EXP_TKN, JWT, STRATEGY, SYSTEM, USER, MEMBER } from '../constantes';
import { LocalStorageAdminService } from '../local-storage-admin.service';
import { MenuService } from '../menu/menu.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends LocalStorageAdminService {

  private url: string = environment.urlSeguridad;
  public username: Subject<any>;
  private subscription$: Subscription;
  public dialogActive: boolean = false;
  private reloadDataPostConfirm: Subject<boolean> = new Subject();
  // public tokenExpirate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private dialog: MatDialog, private menuService: MenuService, private spinner: NgxSpinnerService) { super(); }

  validateUsername(username: string): Observable<any> | Observable<string> {
   // debugger;
    return this.http.get(this.url + 'gestion-usuarios/usuarios/user-name/' + username)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

  login(credential: any): Observable<any> | Observable<string> {
    return this.http.post(this.url + 'login', credential)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

  logout(): void {
    this.clearLocalStorage();
  }

  getTokenExpiration(token: string): Observable<any> | Observable<string> {
    return this.http.get(this.url + 'gestion-usuarios/usuarios/token/' + token)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

  getMemberSystems(userId: number, codeSystem: string): Observable<any> | Observable<string> {
    return this.http.get(this.url + 'gestion-usuarios/miembros/usuario/' + userId)
      .pipe(map((r: any) => {
        if (r.data) {
          const member = this.validateMemberOfSystem(r.data, codeSystem);
          if (!member) { return 'Lo sentimos usted no tiene permitido accesar al sistema'; } {
            return member;
          }
        } else { return r.error; }
      }));
  }

  private validateMemberOfSystem(data: any[], codeSystem: string): any {
    if (!data) { return null; }
    if (data.length < 1) { return null; }
    const systemAllows: any[] = data;
    const memberAllow = data.filter(s => s.sistema.codigo === codeSystem && !s.pasivo);
    if (memberAllow.length < 1) { return null; }
    return memberAllow[0];
  }

  getUnidadesAllowByUser(userId: number, sytemId: number): Observable<any> | Observable<string> {
    return this.http.get(this.url + 'gestion-usuarios/perfil-accesos/unidades/' + userId + '/' + sytemId)
      .pipe(map((r: any) => {
        if (r.data) {
          return r.data;
        } else { return r.error; }
      }));
  }

  tokenIsValid(): boolean {
    //debugger;
    //const datePipe = new DatePipe('es-NI');
    const dateExpToken: Date = new Date(new Date(this.getLocalStorageItem(EXP_TKN).expdate).toISOString());
    const currentDate: Date = new Date(new Date().toISOString());
    if (dateExpToken > currentDate || (dateExpToken === currentDate)) {
      return true;
    } else {
      return false;
    }
  }

  applyConfirmDialog(messageError?: string) {
    this.dialogActive = true;
    if (this.dialog.getDialogById('mat-dialog-1')) { this.dialogActive = false; return; }
    const dialogRef = this.dialog.open(PasswordConfirmComponent, {
      disableClose: true, hasBackdrop: true, closeOnNavigation: false,
      maxWidth: '90%', minWidth: '30%',
      data: {
        user: this.getLocalStorageItem(USER),
        system: this.getLocalStorageItem(SYSTEM) ? this.getLocalStorageItem(SYSTEM) : null,
        strategy: this.getLocalStorageItem(STRATEGY) ? this.getLocalStorageItem(STRATEGY) : null,
        expirationToken: this.getLocalStorageItem(EXP_TKN),
        message: messageError ? messageError : ''
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.spinner.show();
      if (!data) {
        this.spinner.hide();
        this.router.navigate(['logout']);
      } else {
        delete data.user;
        return this.confirmLoginExpired(data.credentials);
      }
    });
  }

  getDateExpirationToken(): number {
    const secToMilliSeconds: number = this.getLocalStorageItem(EXP_TKN).expsec * 1000;
    const minToMilliSeconds: number = Number(this.getLocalStorageItem(EXP_TKN).expmin) === 0 ? 0
      : (Number(this.getLocalStorageItem(EXP_TKN).expmin) * 60) * 1000;
    const hourToMilliSeconds: number = Number(this.getLocalStorageItem(EXP_TKN).exphours) === 0 ? 0 :
      ((Number(this.getLocalStorageItem(EXP_TKN).exphours) * 60) * 60) * 1000;
    const milliSecondsGlobal: number = secToMilliSeconds + minToMilliSeconds + hourToMilliSeconds;
    const dateNumber: number = new Date(this.getLocalStorageItem(EXP_TKN).issuedate).getTime();
    return dateNumber + milliSecondsGlobal;
  }


  private confirmLoginExpired(credentials: { username: string, clave: string }): Observable<boolean> {
    let valid: boolean;
    this.login(credentials).subscribe({
      next: (r: any) => {
        if (r.token) {
          // this.removeLocalStorageItem(EXP_TKN);
          this.setLocalStorage(JWT, r.token);
          this.getTokenExpiration(r.token).subscribe(
            v => {
              if (v.token) {
                delete v.token;
              }
              valid = true;
              this.dialogActive = false;
              this.setReloadDataPostConfirm(true);
              this.setLocalStorage(EXP_TKN, v);
              this.spinner.hide();
              this.menuService.cargarMenu(this.getLocalStorageItem(USER).id, this.getLocalStorageItem(SYSTEM).id)
                .subscribe(m => m);
            });
        } else {
          valid = false;
          this.dialogActive = false;
          this.applyConfirmDialog(r.message);
        }
      },
      error: (e: HttpErrorResponse) => {
        this.spinner.hide(); this.tokenIsValid();
        if (e.status === 401) {
          this.dialogActive = false;
          this.applyConfirmDialog(e.error.message);
        }
      },
      complete: () => {
        return of(valid);
      }
    }
    );
    return of(valid);
  }

  setReloadDataPostConfirm(value: boolean) {
    this.reloadDataPostConfirm.next(value);
  }

  getReloadDataPostConfirm(): Observable<boolean> {
    return this.reloadDataPostConfirm.asObservable();
  }

}
