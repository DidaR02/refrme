import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl} from "@angular/forms";
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";
import { User } from "src/app/Models/userDetails/IUser";
import { AuthenticationService } from "src/app/Service/authentication/authentication.service";
import { EmailValidator, ParentErrorStateMatcher, PasswordValidator } from "src/app/Service/shared/utils/validation";

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.scss']
})
export class SignUpUserComponent implements OnInit {

  isPasswordValid : boolean = true;
  public showOverlay = false;
  submitted = false;
  matchingEmailGroup: FormGroup;
  matchingPasswordsGroup: FormGroup;
  signUpFormGroup: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();

  constructor(public authenticationService: AuthenticationService, public router: Router, public formBuilder: FormBuilder) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)  });
   }

  ngOnInit(): void {
    this.createForms();
  }

  validation_messages =
    {
    'firstName': [
      { type: 'required', message: 'First name is required.' },
      { type: 'minlength', message: 'First name must be at least 2 characters long.' },
      { type: 'maxlength', message: 'First name cannot be more than 30 characters long.' },
      { type: 'pattern', message: 'Your first name must contain only numbers and letters.' }
        ],
    'lastName': [
      { type: 'required', message: 'Last name is required.' },
      { type: 'minlength', message: 'Last name must be at least 2 characters long.' },
      { type: 'maxlength', message: 'Last name cannot be more than 30 characters long.' },
      { type: 'pattern', message: 'Your last name must contain only numbers and letters.' }
        ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
        ],
    'confirmEmail': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
      { type: 'areEqual', message: 'Email mismatch.' }
        ],
    'confirmPassword': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'areEqual', message: 'Password mismatch.' }
        ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
        ],
    'referalPromoCode': [
      { type: 'required', message: 'Your referal promocode is required.' }
        ]
    }
  createForms() {

  // matching email validation
    this.matchingEmailGroup = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
       confirmEmail: new FormControl('',
      Validators.compose([
        Validators.required,
        Validators.email]))
    }, (formGroup: FormGroup) => {
      return EmailValidator.areEqual(formGroup);
    });

    // matching passwords validation
    this.matchingPasswordsGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });


    this.signUpFormGroup = this.formBuilder.group({
    firstName: new FormControl('',
      Validators.compose([Validators.required,
      Validators.minLength(2)])),
    lastName: new FormControl('',
      Validators.compose([Validators.required,
      Validators.minLength(2)])),
    matching_emails: this.matchingEmailGroup,
    matching_passwords: this.matchingPasswordsGroup,
    referalPromoCode: ['', Validators.required]
  });

 }

  async submitSigUpDetails()
  {
    this.showOverlay = true;

    if (this.signUpFormGroup.status === "VALID")
    {
      const signUpDetails = this.signUpFormGroup.value;

      if(signUpDetails?.firstName && signUpDetails?.lastName && signUpDetails?.matching_emails?.email && signUpDetails?.matching_passwords?.password)
      {
        let today = new Date();
        let todayFrmt = today.toISOString().slice(0, 10).replace("-","");
        todayFrmt = todayFrmt.replace("-", "").toString().substring(2);

        let promoAgentCode = "RM" + signUpDetails?.firstName.substring(0, 1).toUpperCase() + signUpDetails?.lastName.substring(0, 1).toUpperCase() + todayFrmt + Math.floor(1000 + Math.random() * 9000).toString().substring(0, 2);

        const newUser: User = {
          uid : '',
          firstName : signUpDetails?.firstName,
          lastName : signUpDetails?.lastName,
          displayName : signUpDetails?.firstName?.substring(0,1).toUpperCase() + ", " +signUpDetails?.lastName,
          email : signUpDetails?.matching_emails?.email,
          emailVerified : false,
          photoURL: '',
          promocode: promoAgentCode?.toUpperCase(),
          referalPromoCode: signUpDetails?.referalPromoCode
        };

        await this.authenticationService.SignUp(newUser, signUpDetails?.matching_passwords?.password);

        //this.signUpFormGroup.reset();
      }
    }
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
