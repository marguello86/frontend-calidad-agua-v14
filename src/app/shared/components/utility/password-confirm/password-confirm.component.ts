import { MatStepper } from '@angular/material/stepper';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es-NI';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

registerLocaleData(localeES, 'es-NI');

@Component({
  selector: 'app-password-confirm',
  templateUrl: './password-confirm.component.html',
  styleUrls: ['./password-confirm.component.scss']
})
export class PasswordConfirmComponent implements OnInit {
  public sessionForm!: FormGroup;
  public passtype: string = 'password';
  public iconViewPass: string = 'lock_open';

  constructor(private dialogRef: MatDialogRef<PasswordConfirmComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeSessionForm();
    if (this.data) {
      this.sessionForm.get('username')?.patchValue(this.data.user.username);
      this.sessionForm.get('username')?.markAsPristine();
    }
  }

  initializeSessionForm(): void {
    this.sessionForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      clave: ['']
    });
  }

  controlHasError(nameValidator: string, frm: FormControl | FormGroup, controlName: string[]): boolean | void {
    if (!controlName) { return; }
    switch (controlName.length) {
      case 0:
        return frm.hasError(nameValidator);
      default:
        if (frm.get(controlName)) {
          return frm.hasError(nameValidator, controlName) && (frm.get(controlName)?.touched);
        } else { return; }
    }
  }

  changeTypeInput(): void {
    switch (this.passtype) {
      case 'password':
        this.passtype = 'text';
        this.iconViewPass = 'lock';
        break;

      default:
        this.passtype = 'password';
        this.iconViewPass = 'lock_open';
        break;
    }
  }

  nextStep(stepper: MatStepper) {
    if (!stepper) { return; }
    stepper.next();
    this.sessionForm.get(['clave'])?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);
    this.sessionForm.get(['clave'])?.updateValueAndValidity();
  }

  handleEnter(event: any): void {
    if (event.target.value.replace(/\s/g, '') === '') {
      this.sessionForm.get(['clave'])?.setErrors({ blankSpace: true });
      return;
    } else { this.tryLogin(); }
  }

  tryLogin(): void {
    if (!this.sessionForm.valid) { return; }
    this.data = {
      user: this.data.user,
      credentials: this.sessionForm.getRawValue()
    };
    this.dialogRef.close(this.data);
  }

  close(): void {
    this.dialogRef.close();
  }

}
