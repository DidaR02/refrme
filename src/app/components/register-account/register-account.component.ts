import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms'; // Reactive form services
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { Router } from "@angular/router";
import { User } from 'src/app/Models/UserModel';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {

  isPasswordValid : boolean = true;

  constructor(public authenticationService: AuthenticationService, public router: Router) { }

  ngOnInit(): void {
  }

  public signUpFormGroup= new FormGroup({
    FirstName: new FormControl(),
    LastName: new FormControl(),
    Email: new FormControl(),
    Password: new FormControl()
  });

  submitSigUpDetails()
  {
    const signUpDetails = this.signUpFormGroup.value;
    if(signUpDetails.ConfirmPassword != signUpDetails.Password)
    {
      this.isPasswordValid = false;
    }
    else
    {
      if(signUpDetails.Email && signUpDetails.Password && signUpDetails.LastName && signUpDetails.LastName)
      {
        let fName: string = signUpDetails.LastName;
        const newUser: User = {
          uid : null,
          firstName : signUpDetails.FirstName,
          lastName : signUpDetails.LastName,
          displayName : fName.substring(0,1).toUpperCase() + ", " +signUpDetails.LastName,
          email : signUpDetails.Email,
          emailVerified : false,
          photoURL: null
        };

        this.authenticationService.SignUp(newUser, signUpDetails.Password);
      }
    }
  }

  resetErrorMsg()
  {
    this.isPasswordValid = true;
  }

  redirectTologin()
  {
    this.router.navigate(['login']);
  }
}
