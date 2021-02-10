import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FireBaseCrudService } from './Service/fire-base-crud.service'
import { FormBuilder } from '@angular/forms'; // Reactive form services


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'RefrMe';
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public fsCrud: FireBaseCrudService,
    public formBuilder: FormBuilder){}

  ngOnInit(){
  }
}
