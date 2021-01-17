import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms'; // Reactive form services
import { AuthenticationService } from '../../service/authentication/authentication.service';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css']
})
export class RegisterAccountComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) { }

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
    let email = signUpDetails.Email;
    let password = signUpDetails.Password;
    if(email && password)
    {
      this.authenticationService.SignUp(email, password);
    }
  }
}
