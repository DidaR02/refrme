import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/userDetails/IUser';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { DataTypeConversionService } from 'src/app/service/shared/dataType-conversion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
isUserSignInAllowed : boolean = true;


  constructor(
    public authService: AuthenticationService,
    public formBuilder: FormBuilder,
    public router: Router,
    public ngZone: NgZone,
    public convertDataType: DataTypeConversionService,) {
   }

  ngOnInit(): void {
  }

  public signInFormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  async submitSignInDetails()
  {
    this.isUserSignInAllowed = true;

    var signInDetails = this.signInFormGroup?.value;
    let email = signInDetails?.email;
    let password = signInDetails?.password;

    if(email && password)
    {
      try {
        //Check if there is current user signedin and signout.
        if (this.authService.isLoggedIn || await this.authService.isSignedInUsersEmailMatch())
        {
          this.authService.SignOut();
        }

        this.authService.SignIn(email, password).then(async (_signInResults): Promise<any> => {

          if (_signInResults) {
            let userAccount = await this.authService.GetDbUserAccount(_signInResults.user);

            if(userAccount && (this.convertDataType.getBoolean(userAccount.emailVerified) != true && this.convertDataType.getBoolean(_signInResults?.user?.emailVerified)))
            {
              userAccount.emailVerified = this.convertDataType.getBoolean(_signInResults?.user?.emailVerified);
            }

            await this.renderUserInfo(userAccount, _signInResults);

            if (this.convertDataType.getBoolean(this.authService?.userAccess?.canLogin))
            {
              //Zone.js does not support async/await.
              this.ngZone.run(() => {
                this.router.navigate(['dashboard']);
              });
            }
            else if (!this.convertDataType.getBoolean(this.authService?.userAccess?.canLogin))
            {
              window.alert("SignIn not allowed.");
              this.isUserSignInAllowed = false;
              // return false;
            }
            else {
              window.alert("SignIn failed!\r\n Please check your input.");
              this.isUserSignInAllowed = false;
              // return false;
            }
          }
        }).catch((error) => {
          window.alert(error.message)
        });
      }
      catch (exception: any) {
        let errorMsg = "Error Signing in:" + exception;
        throw errorMsg;
      };
    }
    else
    {
      this.isUserSignInAllowed = false;
    }
  }

  private async renderUserInfo(userAccount: User, _signInResults: any) {
    await this.authService.SetFsUserData(userAccount, _signInResults.user);
    await this.authService.SetDbUserData(userAccount, _signInResults.user);
    await this.authService.GetUserAccess(_signInResults.user);
  }

  redirectToRegister()
  {
    this.router.navigate(['join']);
  }

  resetPassword(){
    this.router.navigate(['resetPassword']);
  }

  resetErrorMsg()
  {
    this.isUserSignInAllowed = true;
  }
}
