import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms'; // Reactive form services
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isUserSignInAllowed : boolean = true;

  constructor(public authenticationService: AuthenticationService, public formBuilder: FormBuilder, public router: Router) { }

  ngOnInit(): void {
  }

  public signInFormGroup = new FormGroup({
    Email: new FormControl(),
    Password: new FormControl()
  });

  submitSignInDetails()
  {
    this.isUserSignInAllowed = true;

    var signInDetails = this.signInFormGroup?.value;
    let email = signInDetails?.Email;
    let password = signInDetails?.Password;

    if(email && password)
    {
      this.authenticationService.SignIn(email, password);
    }
    else
    {
      this.isUserSignInAllowed = false;
    }
  }

  redirectToRegister()
  {
    this.router.navigate(['join']);
  }

  resetPassword(){
    this.router.navigate(['forgotPassword']);
  }

  resetErrorMsg()
  {
    this.isUserSignInAllowed = true;
  }
}
