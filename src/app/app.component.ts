import { Component, OnInit } from '@angular/core';
import {FireBaseCrudService } from './Service/fire-base-crud.service'
import { FormBuilder } from '@angular/forms'; // Reactive form services


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'RefrMe';
  
  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  ngOnInit(){
  }
}
