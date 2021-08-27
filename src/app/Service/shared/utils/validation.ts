import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string, formGroup: FormGroup): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName) as AbstractControl;
      const checkControl = controls.get(checkControlName) as AbstractControl;

      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control.value !== checkControl.value) {
          controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}

export class ValidatePassword {

  static MatchPassword(abstractControl: AbstractControl): any {
    let password = abstractControl.get('password')?.value;
    let confirmPassword = abstractControl.get('confirmPassword')?.value;
     if (password != confirmPassword) {
         abstractControl.get('confirmPassword')?.setErrors({
           MatchPassword: true
         })
    } else {
       return null;
    }
  }

}
