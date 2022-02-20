import { AbstractControl, FormGroup, ValidatorFn, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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


export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return isSubmitted || (controlTouched && (controlInvalid || parentInvalid));
  }
}
export class PasswordValidator {
  // https://angular-templates.io/tutorials/about/angular-forms-and-validations
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;
    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value
        } else {
          if (value !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
}

export class EmailValidator {
  // https://angular-templates.io/tutorials/about/angular-forms-and-validations
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;
    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value
        } else {
          if (value !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
}
