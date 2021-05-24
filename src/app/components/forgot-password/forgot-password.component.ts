import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  isEmailValid = true;
  
  constructor(
    public authService: AuthenticationService,
    public router: Router,) { }

  ngOnInit(): void {
  }

  public emailFormGroup = new FormGroup({
    Email: new FormControl()
  });

  submitAuthDetails()
  {
    var signInDetails = this.emailFormGroup?.value;
    let email = signInDetails?.Email;

    if(email)
    {
      this.authService.ForgotPassword(email);
    }
    else
    {
      this.isEmailValid = false;
    }
  }

  redirectTologin()
  {
    this.router.navigate(['login']);
  }

  resetErrorMsg()
  {
    this.isEmailValid = true;
  }
}
