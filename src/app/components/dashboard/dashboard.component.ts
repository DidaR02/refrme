import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,private location: Location) { }

  ngOnInit(): void {
  }

  async clickNavigateHandler(url: string)
  {
    if(url.length > 0)
    {
      switch(url){
        case "newSales": {
          this.router.navigate(['dashboard/newsales']);
          break;
        }
      }
    }
  }
}
