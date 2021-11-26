import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.scss']
})
export class ExplorePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

onScrollTo(location: string){
  setTimeout(() => {
    this.router.navigate([], { fragment: location })
      .then(
        res => {
      const element = document.getElementById(location);
      if (element != undefined) element.scrollIntoView();
        });
  }, 500);}
}
