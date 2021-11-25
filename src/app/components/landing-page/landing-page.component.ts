import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/Service/authentication/authentication.service";
import { FireBaseCrudService } from "src/app/service/authentication/fire-base-crud.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public authService: AuthenticationService,
    public router: Router,
    public fsCrud: FireBaseCrudService) {
  }

  ngOnInit(): void {
  }

  redirectToLogin()
  {
    this.router.navigate(['login']);
  }

  redirectToRegister()
  {
    this.router.navigate(['join']);
  }

  redirectToHome()
  {
    this.router.navigate(['home']);
  }

  redirectToExplore()
  {
    this.router.navigate(['explore']);
  }
}
