import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAsignarUnidadComponent } from './dialogo-asignar-unidad.component';

describe('DialogoAsignarUnidadComponent', () => {
  let component: DialogoAsignarUnidadComponent;
  let fixture: ComponentFixture<DialogoAsignarUnidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAsignarUnidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAsignarUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
