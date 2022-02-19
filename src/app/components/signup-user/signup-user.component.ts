import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from "@angular/router";
import { User } from "src/app/Models/userDetails/IUser";
import { AuthenticationService } from "src/app/Service/authentication/authentication.service";

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.scss']
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
    confirmPassword: ['', Validators.required],
    referalPromoCode : ['', Validators.required]
  });

  async submitSigUpDetails()
  {
    this.showOverlay = true;

    const signUpDetails = this.signUpFormGroup.value;
    if(signUpDetails.confirmPassword != signUpDetails.password)
    {
      this.isPasswordValid = false;
    }
    else
    {
      if(signUpDetails.email && signUpDetails.password && signUpDetails.firstName && signUpDetails.lastName)
      {
        let today = new Date();
        let todayFrmt = today.toISOString().slice(0, 10).replace("-","");
        todayFrmt = todayFrmt.replace("-", "").toString().substring(2);

        let fName: string = signUpDetails.lastName;
        let promoAgentCode = "RM" + signUpDetails.firstName.substring(0, 1).toUpperCase() + signUpDetails.lastName.substring(0, 1).toUpperCase() + todayFrmt + Math.floor(1000 + Math.random() * 9000).toString().substring(0, 2);

        const newUser: User = {
          uid : '',
          firstName : signUpDetails.firstName,
          lastName : signUpDetails.lastName,
          displayName : fName.substring(0,1).toUpperCase() + ", " +signUpDetails.lastName,
          email : signUpDetails.email,
          emailVerified : false,
          photoURL: '',
          promocode: promoAgentCode.toUpperCase(),
          referalPromoCode: signUpDetails.referalPromoCode
        };

        await this.authenticationService.SignUp(newUser, signUpDetails.password);
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
