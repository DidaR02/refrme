import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { SalesApplicationFormComponent } from './components/sales-application-form/sales-application-form.component';
import { StandaloneSalesApplicationFormComponent } from './components/standalone-sales-application-form/standalone-sales-application-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'join', component: RegisterAccountComponent},
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: 'dashboard',
        loadChildren: ()=> import('./components/dashboard/dashboard.module').then(dashModule => dashModule.DashboardModule)
  },
  { path: 'new-application', component: StandaloneSalesApplicationFormComponent 
  },
];   

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LandingPageComponent,
  LoginComponent,
  ForgotPasswordComponent,
  RegisterAccountComponent,
  SalesApplicationFormComponent,
  StandaloneSalesApplicationFormComponent
]
