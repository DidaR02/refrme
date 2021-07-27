import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public authService: AuthenticationService,
    public router: Router) { }

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
}
