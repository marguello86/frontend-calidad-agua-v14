import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPersonaComponent } from './dialogo-persona.component';

describe('DialogoPersonaComponent', () => {
  let component: DialogoPersonaComponent;
  let fixture: ComponentFixture<DialogoPersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
