import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDatosClinicosComponent } from './agregar-datos-clinicos.component';

describe('AgregarDatosClinicosComponent', () => {
  let component: AgregarDatosClinicosComponent;
  let fixture: ComponentFixture<AgregarDatosClinicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarDatosClinicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDatosClinicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
