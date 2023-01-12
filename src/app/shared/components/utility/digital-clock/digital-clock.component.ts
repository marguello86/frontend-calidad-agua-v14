import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClockService } from 'src/app/services/service.index';
import { Observable, Subscription, Subject } from 'rxjs';
import { Clock } from 'src/app/shared/models/util/clock';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.scss']
})
export class DigitalClockComponent implements OnInit, OnDestroy {

  datos$!: Observable<Clock>;
  hora!: string;
  minutos!: string;
  dia!: string;
  fecha!: string;
  ampm!: string;
  segundos!: string;
  private subscription$!: Subscription;
  private subject$: Subject<any | null> = new Subject();

  constructor(private clockService: ClockService) { }

  ngOnInit() {
    this.datos$ = this.clockService.getInfoReloj();
    this.subscription$ = this.datos$
      .pipe(takeUntil(this.subject$)).subscribe(x => {
      this.hora = x.hora;
        this.minutos = x.minutos;
        this.dia = x.diadesemana;
        this.fecha = x.diaymes;
        this.ampm = x.ampm;
        this.segundos = x.segundo;
      });
  }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
    this.subject$.next(true);
    this.subject$.complete();
  }
}
