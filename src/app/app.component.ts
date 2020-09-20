import { Component, OnInit } from '@angular/core';
import {UserPersonalDetails,AddresDetails} from './Models/UserModel';
import { ServiceProvider, UserServiceProvider} from './Models/ServiceProviderModel';
import {FireBaseCrudService} from './Service/fire-base-crud.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
import { NetworkOperator, NetworkOperatorProducts } from './Models/NetworkOperatorModel';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RefrMe';
  networkOperators: NetworkOperator[];
  serviceProvider: ServiceProvider[];
  networkOperatorProducts: NetworkOperatorProducts[];
  productListMessage: string[] = [];
  netOpId: string = "";
  netOpName: string = "";

  servProvId: string = "1";
  servProvName: string = "ReferMe";
  

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  ngOnInit(){
    this.getNetworkOperator();
    this.getServiceProvider();
    //this.buildNetworkOperatorProductListMessage();
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
          this.netOpId = this.networkOperators[0]?.NetOpId;
          this.netOpName = this.networkOperators[0]?.NetOpName.replace(" Home Fibre", "");
          this.getNetworkOperatorProducts(this.netOpId);
        }
      }
    );
  };

  getNetworkOperatorProducts(networkProviderId: string){
    let getNetworkOperatorProductList = this.fsCrud.getNetworkOperatorProducts();
    getNetworkOperatorProductList.snapshotChanges().subscribe(
      data => {
        this.networkOperatorProducts = [];
        data.forEach(item =>{
            if(item.key == this.netOpId)
            {
              let products = item.payload.toJSON();
              if(products){
                this.networkOperatorProducts.push(products as NetworkOperatorProducts);
              }
            }
          }
        );
        this.buildNetworkOperatorProductListMessage(this.networkOperatorProducts);
      },
      function(error){
        console.log("This is error getNetworkOperatorProductList",error);
      },
      function(){
        this.buildNetworkOperatorProductListMessage(this.networkOperatorProducts);
      }
    );

    
  }

  buildNetworkOperatorProductListMessage(networkOperatorProducts: NetworkOperatorProducts[])
  {
    if(this.networkOperatorProducts && this.networkOperatorProducts.length > 0)
    {
      for(var product = 0 ; product < this.networkOperatorProducts.length; prod++)
      {
        var products = this.networkOperatorProducts[product]['Products'];
        for(var prod = 0 ; prod <= products.length; prod++) {
          this.productListMessage = [];
          this.productListMessage.push();
        };
        //console.log("products", this.networkOperatorProducts[prod]['Products']);
      }
    }
  }

  getServiceProvider(){
    let getServiceProviderpList = this.fsCrud.getServiceProvider();
    getServiceProviderpList.snapshotChanges().subscribe(
      data =>{
        this.serviceProvider = [];
        data.forEach( item =>{
          let sp = item.payload.toJSON();
          if(sp)
          {
            this.serviceProvider.push(sp as ServiceProvider);
          }
        });
        if(this.serviceProvider)
        {
          this.servProvId = this.serviceProvider[0]?.ServiceProviderId;
          this.servProvName = this.serviceProvider[0]?.ServiceProviderName;
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
      {
        this.netOpId = this.networkOperators[getOpItem]?.NetOpId;
        this.netOpName = this.networkOperators[getOpItem]?.NetOpName.replace(" Home Fibre", "");
      }
    }

    if(this.netOpId != null || this.netOpId != undefined || this.netOpId != "")
    {
          this.getNetworkOperatorProducts(this.netOpId);
    }

  }

  submitUserDetails(){

    //NewUser
    this.fsCrud.saveUserDetails(this.userPersonalDetails.value);

    //

    //reset form
    this.ResetForm(); 
  }
}
