import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoContactoPacienteComponent } from './dialogo-contacto-paciente.component';

describe('DialogoContactoPacienteComponent', () => {
  let component: DialogoContactoPacienteComponent;
  let fixture: ComponentFixture<DialogoContactoPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoContactoPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoContactoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
