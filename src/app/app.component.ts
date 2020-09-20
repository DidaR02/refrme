import { Component } from '@angular/core';
import {UserPersonalDetails,AddresDetails} from './Models/UserModel';
import {FireBaseCrudService} from './Service/fire-base-crud.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RefrMe';

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  //private selectedProvince: string = "";

  public userPersonalDetails = new FormGroup({
    FirstName: new FormControl(),
    LastName: new FormControl(),
    IdNumber: new FormControl(),
    Email: new FormControl(),
    MobileNumber: new FormControl(),
    AddressDetails: new FormGroup({
      AddressLine1: new FormControl(),
      AddressLine2: new FormControl(),
      City: new FormControl(),
      Province: new FormControl(),
      ZipCode: new FormControl(),
      Suburb: new FormControl(),
      AddressType: new FormControl() //FreeS
    })
  });

  ResetForm() {
    this.userPersonalDetails.reset();
  } 

  onStateProvinceSelected(event){
    //this.selectedProvince = event.target.value;
     if(this.userPersonalDetails)
     {
       // this.userPersonalDetails = FormBuilder
      
       // .AddressDetails.Province = event.target.value;
     }

  }

  submitUserDetails(){
    this.fsCrud.saveUserDetails(this.userPersonalDetails.value);
    this.ResetForm(); 
  }
}
