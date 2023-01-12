import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoMinsaPersonalComponent } from './dialogo-minsa-personal.component';

describe('DialogoMinsaPersonalComponent', () => {
  let component: DialogoMinsaPersonalComponent;
  let fixture: ComponentFixture<DialogoMinsaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoMinsaPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoMinsaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
