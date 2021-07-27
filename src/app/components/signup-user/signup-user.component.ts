import { Component,OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'; // Reactive form services
import { ActivatedRoute, Event as RouterEvent, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { User } from '../../models/userDetails/IUser'

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css']
})
export class SignUpUserComponent implements OnInit {

  isPasswordValid : boolean = true;
  public showOverlay = false;
  submitted = false;

  constructor(public authenticationService: AuthenticationService, public router: Router, public formBuilder: FormBuilder) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)  });
   }

  ngOnInit(): void {
  }

  public signUpFormGroup= this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    confirmEmail:  ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  submitSigUpDetails()
  {
    this.showOverlay = true;

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
          uid : '',
          firstName : signUpDetails.FirstName,
          lastName : signUpDetails.LastName,
          displayName : fName.substring(0,1).toUpperCase() + ", " +signUpDetails.LastName,
          email : signUpDetails.Email,
          emailVerified : false,
          photoURL: '',
          promocode: "FirstName3letters. 3 letter surname, 3 numbers(date of registrations mmddyyxx)"
        };

        this.authenticationService.SignUp(newUser, signUpDetails.Password);
      }
    }
  }

  resetErrorMsg()
  {
    this.isPasswordValid = true;
  }

  redirectToLogin()
  {
    this.router.navigate(['login']);
  }


   // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }

}
