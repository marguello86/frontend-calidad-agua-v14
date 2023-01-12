import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { PersonaService, LoginService, SistemaService, RolService, UsuarioService, } from 'src/app/services/service.index';
import { EDITOR, RESULT, SEARCH, MOD_PRS, ROLES_ALLOW_PERSONA } from 'src/app/shared/components/persona/persona.const';
import { Paginacion, Persona } from 'src/app/shared/models/persona/persona.models';
import Swal from 'sweetalert2';
import { CODE_SYSTEM_PERSONA, USER } from 'src/app/services/constantes';
import { ErrorDetail } from 'src/app/shared/models/util/error-detail';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit, OnDestroy {

  @Input('mode') mode: string = SEARCH;
  @Input('listPersona') listPersona: Persona[];
  @Input('paginator') paginator: Paginacion;

  @Output('result') result: EventEmitter<any> = new EventEmitter();
  @Output('paginacion') paginacion: EventEmitter<Paginacion> = new EventEmitter();
  @Output('selected') selected: EventEmitter<any> = new EventEmitter();
  @Output('showDialog') showDialog: EventEmitter<boolean> = new EventEmitter();

  public editorC: string = EDITOR;
  public resultC: string = RESULT;
  public searchC: string = SEARCH;
  public parentRequest: string = MOD_PRS;
  public dontShowComponent: boolean = true;
  public deniedAccess: ErrorDetail;
  private subscription$: Subscription;
  private memberPerson: any;
  public hasRoleForCreated: boolean = false;
  public busquedaPorTipo: string = 'persona'

  constructor(private api: PersonaService, private loginService: LoginService,
    private rolService: RolService, private sistemaService: SistemaService,
    private usuarioService: UsuarioService) {
    this.evaluePermissions();
    this.getRolesBySystem();
  }

  ngOnInit() {
    switch (this.mode) {
      case EDITOR:
        break;
      case RESULT:
        if (!this.listPersona) { Swal.fire('Oops! No hemos recibido ningún dato', 'Información Incompleta', 'error'); return; }
        break;

      default:
        break;
    }

  }

  hasData(result: any) {
    if (result) {
      if (this.mode === SEARCH) {
        this.mode = RESULT;
        this.listPersona = result;
      }
      this.result.emit(result);
    }
  }

  hasPaginacion(paginacion: Paginacion) {
    if (!paginacion) { return; }

    this.paginator = paginacion;
    this.paginacion.emit(paginacion);
  }

  loadDialogEditorPerson(load: boolean): void {
    this.showDialog.emit(true);
  }

  cancelResult() {
    this.listPersona = null;
    this.result.next(null);
    this.paginacion.next(null);
    this.result.complete();
    this.paginacion.complete();
    this.mode = SEARCH;
  }

  evaluePermissions(): void {
    this.subscription$ = this.loginService.getMemberSystems(this.loginService.getLocalStorageItem(USER).id, CODE_SYSTEM_PERSONA)
      .subscribe({
        next: r => {
          if (!r.id) {
            this.deniedAccess = {
              title: 'Privilegios insuficientes',
              message: 'No se pueden mostrar los controles para creación de captación ' +
                ', ya que no eres miembro del sistema de Persona. Contacte al administrador del Sistema',
              buttons: [{
                name: 'Reintentar',
                code: 'RT',
                color: 'accent',
                disabled: false,
                icon: {
                  name: 'refresh'
                }
              }]
            };
            this.dontShowComponent = true;
          } else { this.deniedAccess = null; this.dontShowComponent = false; this.memberPerson = r; }
        },
        error: (e: HttpErrorResponse) => {
          this.deniedAccess = {
            title: 'No se puede solicitar permisos',
            message: e.message,
            buttons: [{
              name: 'Reintentar',
              code: 'RT',
              color: 'accent',
              disabled: false,
              icon: {
                name: 'refresh'
              }
            }]
          };
          this.dontShowComponent = true;
        },
        complete: () => { }
      });
  }

  captureAction(codeAction: string): void {
    if (!codeAction) { return; }
    switch (codeAction) {
      case 'RT':
        this.subscription$ = this.loginService.getMemberSystems(this.loginService.getLocalStorageItem(USER).id, CODE_SYSTEM_PERSONA)
          .subscribe({
            next:
              r => {
                if (!r.id) {
                  Swal.fire('Sin acceso', r, 'warning');
                } else { this.deniedAccess = null; this.dontShowComponent = false; }
              },
            error: (e: HttpErrorResponse) => {
              this.deniedAccess = {
                title: 'No se puede solicitar permisos',
                message: e.message,
                buttons: [{
                  name: 'Reintentar',
                  code: 'RT',
                  color: 'accent',
                  disabled: false,
                  icon: {
                    name: 'refresh'
                  }
                }]
              };
              this.dontShowComponent = true;
            },
            complete: () => { }
          }
          );
        break;

      default:
        break;
    }
  }

  getRolesBySystem(): void {
    let systemPerson: any;
    this.subscription$ = this.sistemaService.obtenerPorCodigo(CODE_SYSTEM_PERSONA).subscribe({
      next: (s) => { if (s.data) { systemPerson = s.data[0]; } },
      error: (e: HttpErrorResponse) => Swal.fire('Inconvenientes de comunicación', e.message, 'error'),
      complete: () => {
        if (systemPerson) {
          this.rolService.getRoleBySystem(systemPerson.id)
            .subscribe({
              next: (r) => null,
              error: (e: HttpErrorResponse) => Swal.fire('Inconvenientes de comunicación', e.message, 'error'),
              complete: () => {
                if (this.memberPerson) {
                  this.usuarioService.getMemberRole(this.memberPerson.id, 0)
                    .subscribe({
                      next: (r) => {
                        if (r) {
                          if (r.length > 0 && r instanceof Array) {
                            r.forEach(a => {
                              if (this.hasRoleForCreated) { return; }
                              if (!a.pasivo) {
                                ROLES_ALLOW_PERSONA.forEach(rol => {
                                  if (rol === a.rol.nombre.toLowerCase()) {
                                    this.hasRoleForCreated = true;
                                    return;
                                  }
                                });
                              } else { this.hasRoleForCreated = false; }
                            });
                          }
                        }
                      },
                      error: (e: HttpErrorResponse) => Swal.fire('Inconvenientes de comunicación', e.message, 'error'),
                      complete: () => { }
                    });
                }
              }
            });
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }

}
