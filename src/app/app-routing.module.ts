import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { AuthGuard } from "./service/guard/auth.guard";
import { SalesApplicationFormComponent } from './components/sales-application-form/sales-application-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'join', component: RegisterAccountComponent},
  { path: 'dashboard', component: DashboardComponent,
      children: [{
        path: 'newsales',
        component: SalesApplicationFormComponent
      }]},
  // { path: 'dashboard',
  // loadChildren: ()=> import('./components/dashboard/dashboard.module').then(dBoard  => dBoard.DashboardModule), canActivate: [AuthGuard] },
  //{ path: 'newsales', loadChildren: ()=> import('./components/sales-application-form/sales-application-form.module').then(salesAppForm => salesAppForm.SalesApplicationFormModule), canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LandingPageComponent,
  LoginComponent,
  RegisterAccountComponent,
  DashboardComponent,
  SalesApplicationFormComponent
]
