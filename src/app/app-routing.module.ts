import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { SalesApplicationFormComponent } from './components/sales-application-form/sales-application-form.component';
import { SignUpUserComponent } from './components/signup-user/signup-user.component';
import { StandaloneSalesApplicationFormComponent } from './components/standalone-sales-application-form/standalone-sales-application-form.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './service/guard/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'landing', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'join', component: SignUpUserComponent},
  { path: 'dashboard',
        loadChildren: ()=> import('./components/dashboard/dashboard.module').then(dashModule => dashModule.DashboardModule)
  },
  { path: 'resetPassword', redirectTo: '/forgotPassword', pathMatch: 'full'},
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: 'verify', redirectTo: '/verify-email-address', pathMatch: 'full' },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'new-application', component: StandaloneSalesApplicationFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LandingPageComponent,
  LoginComponent,
  SalesApplicationFormComponent,
  ForgotPasswordComponent,
  VerifyEmailComponent,
  SignUpUserComponent,
  StandaloneSalesApplicationFormComponent
]
