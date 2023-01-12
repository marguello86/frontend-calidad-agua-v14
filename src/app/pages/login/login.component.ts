import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { CODE_SYSTEM } from 'src/app/services/constantes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  /*variables */
  public principal: boolean = false;
  public anioSistema: Date = new Date();
  public msgValidarUser: string = 'Ingresar Usuario';
  public fGroupUser!: FormGroup;
  public color: string ='';
  public mode: string ='';
  public value: string ='';
  public campoRequerido: boolean = false;
  private isLocal: boolean = false;
  private subscription$!: Subscription;


  /*variables */
  constructor(private fb: FormBuilder,
    private seguridadService: LoginService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute, private titleService: Title
  ) {
    if (this.activatedRoute.data) {
      this.activatedRoute.data.subscribe(t => t['titulo'] ? this.titleService.setTitle(CODE_SYSTEM + ' | ' + t['titulo']) : null);
    }
    this.isLocal = environment.local;
    this.initFormGroup();
  }

  ngOnInit() {
    this.principal = true;
    if (this.seguridadService.getLocalStorageItem('JWT') && this.seguridadService.getLocalStorageItem('userObj')) {
      this.router.navigate(['']);
    } else {
      if (!this.isLocal) {
        window.location.href = `http://${window.location.host}/portalminsa/`;
      } else { this.router.navigate(['login']); this.principal = true; }
    }
  }

  initFormGroup() {
    this.fGroupUser = this.fb.group({
      username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)])
    });
  }

  handleEnter(event: any): void {
    this.spinner.show();
    setTimeout(() => {
      if (!event.target.value || event.target.value === '' || event.target.value.length < 4) {
        this.spinner.hide();
        Swal.fire('Ingresar Nombre de Usuario válido', 'Validación Nombre de Usuario', 'warning');
        return;
      } else {
        this.validateUsername();
      }
    }, 1000);
  }

  validateUsername() {
    if (this.fGroupUser.get('username').value.replace(/\s/g, '') === '') {
      this.spinner.hide();
      const usrHtml: HTMLElement = document.getElementById('mffUsrnm') as HTMLElement;
      usrHtml.classList.add('animated', 'shake', 'delay-2s');
     Swal.fire('Una cadena vacía NO es un usuario válido', 'Usuario Inválido', 'error');
      return;
    }
    this.subscription$ = this.seguridadService.validateUsername(this.fGroupUser.get('username').value)
      .subscribe({
        next: (r) => {
          if (r instanceof Array) {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                username: r[0].username
              }
            };
            this.spinner.hide();
            if (!this.seguridadService.getLocalStorageItem('userObj')) {
            this.seguridadService.setLocalStorage('userObj', r[0]);
            }
            this.router.navigate(['/uservalidated'], navigationExtras);
          } else {
            this.spinner.hide();
            const usrHtml: HTMLElement = document.getElementById('mffUsrnm') as HTMLElement;
            usrHtml.classList.add('animated', 'shake', 'delay-2s');
            Swal.fire(r, 'No podemos continuar', 'error');
            return;
          }
        },
        error: (e: HttpErrorResponse) => {
          this.spinner.hide();
          const usrHtml: HTMLElement = document.getElementById('mffUsrnm') as HTMLElement;
          usrHtml.classList.add('animated', 'shake', 'delay-2s');
          if (e.error.message) {
            Swal.fire(e.error.message, 'Imposible validar Nombre de Usuario', 'error');
            return;
          } else {
            switch (e.status) {
              case 504:
               Swal.fire('No se puede establecer comunicación. Código ' + e.status + ' ' + e.statusText,
                  'Imposible validar Nombre de Usuario', 'error');
                break;
              case 403:
                Swal.fire('Ación No Permitida', 'Contactar a Soporte de Sistemas', 'error');
                break;
              default:
                Swal.fire(e.message, 'Contactar a Soporte de Sistemas', 'error');
                break;
            }
          }
        },
        complete: () => { }
      });
  }
  recordarUsuario(): void { }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

}
