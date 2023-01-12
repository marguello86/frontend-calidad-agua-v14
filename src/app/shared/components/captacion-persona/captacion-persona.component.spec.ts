import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptacionPersonaComponent } from './captacion-persona.component';

describe('CaptacionPersonaComponent', () => {
  let component: CaptacionPersonaComponent;
  let fixture: ComponentFixture<CaptacionPersonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptacionPersonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptacionPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
