import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/seguridad/login.service';
import { UsuarioGeneral } from 'src/app/shared/models/seguridad/usuario-general';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { CODE_SYSTEM, USER, JWT } from 'src/app/services/constantes';



@Component({
  selector: 'app-next-step-login',
  templateUrl: './next-step-login.component.html',
  styleUrls: ['./next-step-login.component.scss']
})
export class NextStepLoginComponent implements OnInit, OnDestroy {

  public anioSistema: Date = new Date();
  public msgValidarUser: string = 'Ingrese su contraseña';
  public passtype: string = 'password';
  public fGroupUser: FormGroup;
  public principal: boolean;
  public campoRequerido: boolean;
  public email: string;
  public iconViewPass: string = 'lock_open';
  public usuario: UsuarioGeneral;
  private subscription$: Subscription;


  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private fb: FormBuilder, private seguridadService: LoginService,
    private spinner: NgxSpinnerService, private titleService: Title) {
    if (this.activatedRoute.data) {
      this.activatedRoute.data.subscribe(t => t['titulo'] ? this.titleService.setTitle(CODE_SYSTEM + ' | ' + t['titulo']) : null);
    }
  }

  ngOnInit() {   
    this.usuario = this.seguridadService.getLocalStorageItem('userObj');
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.fGroupUser = this.fb.group({
      password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)])
    });
  }

  changeTypeInput(): void {
    switch (this.passtype) {
      case 'password':
        this.passtype = 'text';
        this.iconViewPass = 'lock';
        break;

      default:
        this.passtype = 'password';
        this.iconViewPass = 'lock_open';
        break;
    }
  }

  handleEnter(event: any): void {
    this.spinner.show();
    if (!event.target.value || event.target.value === '' || event.target.value.length < 4) {
      this.spinner.hide();
      Swal.fire('Ingresar Contraseña de => ' + this.usuario.username, 'Inicio de Sesión inválido', 'error');
      return;
    } else {
      this.validate();
    }
  }

  regresar(): void {
    this.router.navigate(['']);
  }

  validate(): void {
    const pass: string = this.fGroupUser.get('password').value;
    if (pass.replace(/\s/g, '') === '') {
      this.spinner.hide();
      const usrHtml: HTMLElement = document.getElementById('mffPass') as HTMLElement;
      usrHtml.classList.add('animated', 'shake', 'delay-2s');
      Swal.fire('Una cadena vacía NO es una contraseña válida', 'Contraseña Inválida', 'error');
      return;
    }
    const credentials: { username: string, clave: string } =
      { username: this.usuario.username, clave: this.fGroupUser.get('password').value };
    this.subscription$ = this.seguridadService.login(credentials).subscribe({
      next: (r: any) => {
        if (r.token) {
          this.spinner.hide();
          this.usuario.id = r.usuarioid;
          this.seguridadService.setLocalStorage(JWT, r.token);
          this.seguridadService.setLocalStorage(USER, this.usuario);
          this.router.navigate(['dashboard']);
        } else {
          this.spinner.hide();
          const usrHtml: HTMLElement = document.getElementById('mffPass') as HTMLElement;
          usrHtml.classList.add('animated', 'shake', 'delay-2s');
          Swal.fire(r, 'Inicio de Sesión inválido', 'error');
          return;
        }
      },
      error: (e: HttpErrorResponse) => {
        this.spinner.hide();
        const usrHtml: HTMLElement = document.getElementById('mffPass') as HTMLElement;
        usrHtml.classList.add('animated', 'shake', 'delay-2s');
        if (e.error.message) {
          Swal.fire(e.error.message, 'Inicio de Sesión inválido', 'error');
          return;
        } else {
          switch (e.status) {
            case 504:
              Swal.fire('No se puede establecer comunicación. Código ' + e.status + ' ' + e.statusText, 'Inicio de Sesión inválido', 'error');
              break;
            default:
              break;
          }

        }
      },
      complete: () => { }
    }
    );
  }

  recordarClave(): void { }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

}
