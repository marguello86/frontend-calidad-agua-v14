import { Injectable } from '@angular/core';
import { map, Observable, Subject, timer } from 'rxjs';
import { LocalStorageAdminService } from './local-storage-admin.service';
import { EXP_TKN } from './constantes';
import { Clock } from 'src/app/shared/models/util/clock';
import { shareReplay } from 'rxjs/operators';
import { LoginService } from './seguridad/login.service';

@Injectable({
  providedIn: 'root'
})

export class ClockService extends LocalStorageAdminService {
  clock: Observable<Date>;
  infofecha$ = new Subject<Clock>();
  vr!: Clock;
  ampm!: string;
  hours!: number;
  minute!: string;
  weekday!: string;
  months!: string;
  private dialogActive: boolean = false;

  constructor(private loginService: LoginService) {
    super();
    this.clock = timer(0, 1000).pipe(map(t => new Date()), shareReplay(1));
  }

  getInfoReloj(): Observable<Clock> {
    this.clock.subscribe(t => {
      this.validateTokenExpirate(t);
      this.hours = t.getHours() % 12;
      this.hours = this.hours ? this.hours : 12;
      this.vr = {
        hora: this.hours < 10 ? '0' + this.hours : this.hours + '',
        minutos: (t.getMinutes() < 10) ? '0' + t.getMinutes() : t.getMinutes().toString(),
        ampm: t.getHours() > 11 ? 'PM' : 'AM',
        diaymes: t.toLocaleString('es-NI', { day: '2-digit', month: 'long' }).replace('.', '').replace('-', ' '),
        diadesemana: t.toLocaleString('es-NI', { weekday: 'long' }).replace('.', ''),
        segundo: t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds().toString()
      };
      this.infofecha$.next(this.vr);
    });
    return this.infofecha$.asObservable();
  }

  validateTokenExpirate(currentDate: Date): void {
    // this.loginService.tokenIsValid().subscribe({ next: (v: boolean) => console.log('valueToken Valid -> ', v) });
    if (!this.getLocalStorageItem(EXP_TKN)) { return; }
    const expDate: Date | null = this.getLocalStorageItem(EXP_TKN).expdate ? new Date(this.getLocalStorageItem(EXP_TKN).expdate) : null;
    if (!expDate) { return; }
    if ((expDate === currentDate || expDate < currentDate) && !this.loginService.dialogActive) {
      // this.dialogActive = this.loginService.tokenIsValid();
      this.loginService.applyConfirmDialog();
    }
  }
}
