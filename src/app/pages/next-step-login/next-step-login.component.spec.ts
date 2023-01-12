import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextStepLoginComponent } from './next-step-login.component';

describe('NextStepLoginComponent', () => {
  let component: NextStepLoginComponent;
  let fixture: ComponentFixture<NextStepLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextStepLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextStepLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
