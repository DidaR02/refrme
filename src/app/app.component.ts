import { Component, OnInit } from '@angular/core';
import {UserPersonalDetails,AddresDetails} from './Models/UserModel';
import {FireBaseCrudService} from './Service/fire-base-crud.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
import { NetworkOperator } from './Models/NetworkOperatorModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RefrMe';
  networkOperators: NetworkOperator[];
  netOpName: string = "";

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  ngOnInit(){
    this.getNetworkOperator();
  }

  getNetworkOperator(){
    let netOpList = this.fsCrud.getNetworkOperator();
    netOpList.snapshotChanges().subscribe(
      data =>{
        this.networkOperators = [];
        data.forEach( item =>{
          let operator = item.payload.toJSON();
          operator['NetOpId'] = item.key
           if(operator)
          {
            this.networkOperators.push(operator as NetworkOperator);
          }
        });
        if(this.networkOperators)
        {
          this.netOpName = this.networkOperators[0]?.NetOpName.replace(" Home Fibre", "");
        }
      }
    );
  };

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

  onSelectedNetworkOperator(event){
    if(this.networkOperators)
    {
      const selectedNetOpId = event.target.value;
      const getOpItem = this.networkOperators.map(opId => opId.NetOpId).indexOf(selectedNetOpId);
      if(getOpItem)
        this.netOpName = this.networkOperators[getOpItem]?.NetOpName.replace(" Home Fibre", "");
    }

  }

  submitUserDetails(){
    this.fsCrud.saveUserDetails(this.userPersonalDetails.value);
    this.ResetForm(); 
  }
}
