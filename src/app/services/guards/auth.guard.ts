import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { JWT, USER } from '../constantes';
import { LoginService } from '../service.index';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private spinner: NgxSpinnerService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.spinner.show();
    if (!this.validateLocalStorageLogged()) {
      this.router.navigate(['logout']);
    }
    this.spinner.hide();
    return this.validateLocalStorageLogged();
  }

  private validateLocalStorageLogged(): boolean {
    return this.loginService.getLocalStorageItem(JWT) && this.loginService.getLocalStorageItem(USER)
      ? true : false;
  }

}
