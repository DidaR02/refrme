import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireStorageModule} from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
import { ContentPanelComponent } from './components/content-panel/content-panel.component';
import { FooterPanelComponent } from './components/footer-panel/footer-panel.component';
import { NavigationTopPanelComponent } from './components/navigation-top-panel/navigation-top-panel.component';
//import { ViewSalesApplicationComponent } from './components/view-sales-application/view-sales-application.component';
//import { DashboardModule } from './components/dashboard/dashboard.module'
//import { DashboardComponent } from './components/dashboard/dashboard.component';
//import { SalesApplicationFormComponent } from './components/sales-application-form/sales-application-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterAccountComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ContentPanelComponent,
    FooterPanelComponent,
    NavigationTopPanelComponent,
    routingComponents,
    NavigationPanelComponent,
    //ViewSalesApplicationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    CommonModule,
    //DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
