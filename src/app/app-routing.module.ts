import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterAccountComponent } from './components/register-account/register-account.component'
import { DashboardModule } from './components/dashboard/dashboard.module'
import { AuthGuard } from "./service/guard/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'join', component: RegisterAccountComponent,},
  { path: 'dashboard', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', 
  loadChildren: ()=> import('./components/dashboard/dashboard.module').then(dBoard  => dBoard.DashboardModule) , canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LandingPageComponent,
  LoginComponent,
  RegisterAccountComponent
]
