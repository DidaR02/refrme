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
      },
      {
        path: 'viewsales',
        loadChildren: ()=> import('./components/view-sales-application/view-sales-application.module').then(viewSales => viewSales.ViewSalesApplicationModule)
      }]
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
  RegisterAccountComponent,
  DashboardComponent,
  SalesApplicationFormComponent
]
