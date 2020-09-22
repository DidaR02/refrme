import { Component, Input, OnInit } from '@angular/core';
import {UserPersonalDetails,AddresDetails} from './Models/UserModel';
import { ServiceProvider, UserServiceProvider} from './Models/ServiceProviderModel';
import {FireBaseCrudService} from './Service/fire-base-crud.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // Reactive form services
import { NetworkOperator, NetworkOperatorProducts, ProductMessage } from './Models/NetworkOperatorModel';
// import { IfStmt } from '@angular/compiler';
import { DeliveryInstallOption } from './Models/DeliveryInstallOption';
import { SaleApplication } from './Models/SalesApplicationModel'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RefrMe';
  networkOperators: NetworkOperator[];
  serviceProvider: ServiceProvider[] = [];
  networkOperatorProducts: NetworkOperatorProducts[];
  productListMessage: ProductMessage[] = [];
  networkOperatorId: string = "";
  networkOperatorName: string = "";

  servProvId: string = "1";
  servProvName: string = "ReferMe";
  
  @Input() AddressType: FormControl = new FormControl();
  @Input() DeliveryInstallOption: FormControl = new FormControl();

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  ngOnInit(){
    this.getNetworkOperator();
    this.getServiceProvider();
    
    console.log(this.serviceProvider.indexOf(this.serviceProvider[1]));
  }

  getNetworkOperator(){
    let netOpList = this.fsCrud.getNetworkOperator();
    netOpList.snapshotChanges().subscribe(
      data =>{
        this.networkOperators = [];
        data.forEach( item =>{
          let operator = item.payload.toJSON();
          operator['NetworkOperatorId'] = item.key
           if(operator)
          {
            this.networkOperators.push(operator as NetworkOperator);
          }
        });
        if(this.networkOperators)
        {
          this.networkOperatorId = this.networkOperators[0]?.NetworkOperatorId;
          this.networkOperatorName = this.networkOperators[0]?.NetworkOperatorName;
          this.getNetworkOperatorProducts(this.networkOperatorId);
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
            if(item.key == this.networkOperatorId)
            {
              let products = item.payload.toJSON();
              if(products){
                this.networkOperatorProducts.push(products as NetworkOperatorProducts);
              }
            }
          }
        );

        if(this.networkOperatorProducts[0]){
          this.productListMessage = [];

          for(var prodList = 0 ; prodList < this.networkOperatorProducts.length; prodList++){
            
            if(this.networkOperatorProducts[prodList]['Products']){
              for(var prodItem in this.networkOperatorProducts[prodList]['Products']){

                let message = new ProductMessage();
                message.OperatorId = this.networkOperatorId;
                message.prodId = this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdId'];
                message.OperatorName = this.networkOperatorName;
                message.ProductMessage = this.buildNetworkOperatorProductListMessage(this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdName'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['Download'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['Upload'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdPrice'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['PaymentTerms'],
                   "R1725",
                   "R499");
                
                this.productListMessage.push(message as ProductMessage);
              }
            }
          }
        }
      },
      function(error){
        console.log("This is error getNetworkOperatorProductList",error);
      },
      function(){
      }
    );

    
  }

  buildNetworkOperatorProductListMessage( productName: string, download: string, upload: string, amount: string, payTerms: string, installAmount: string, existInstallAmount: string)
  {
    enum payMentTerms{
      "Monthly" = "Per Month"
    };

    var message = this.networkOperatorName + " " + productName + " " + download +"Mbps Download and "+ upload +"Mbps Upload: R"+amount+ " " +payMentTerms.Monthly+ " (New Installation and Activation R1725) - (Existing Installation activation R499)";
    return message;
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

  public addressDetails= new FormGroup({
    AddressLine1: new FormControl(),
    AddressLine2: new FormControl(),
    City: new FormControl(),
    Province: new FormControl(),
    ZipCode: new FormControl(),
    Suburb: new FormControl(),
    AddressType: new FormControl(this.AddressType.value) //FreeS
  });

  public userPersonalDetails = new FormGroup({
    FirstName: new FormControl(),
    LastName: new FormControl(),
    IdNumber: new FormControl(),
    Email: new FormControl(),
    MobileNumber: new FormControl(),
    AddressDetails: new FormGroup(this.addressDetails.controls),
    SpecialComments: new FormControl()
  });

  public deliveryInstallOption = new FormGroup({
    DeliveryInstallOption: new FormControl(this.DeliveryInstallOption.value)
  });

  //private serviceProviderB: ServiceProvider = this.serviceProvider[this.serviceProvider.findIndex(x => x.ServiceProviderId === this.servProvId)]; 

  public salesApplication = new FormGroup({
    AgentPromoCode: new FormControl(),
    ServiceProvider: new FormControl(),
    NetworkOperator: new FormControl(),
    IsCpeFirbreInstalled: new FormControl(),
    NetworkOperatorPackage: new FormControl(),
    UserPersonalDetails: new FormGroup(this.userPersonalDetails.controls)
  });

  ResetForm() {
    this.salesApplication.reset();
    this.userPersonalDetails.reset();
  } 

  onSelectedNetworkOperator(event){
    if(this.networkOperators)
    {
      const selectedNetOpId = event.target.value;
      const getOpItem = this.networkOperators.map(opId => opId.NetworkOperatorId).indexOf(selectedNetOpId);
      if(getOpItem)
      {
        this.networkOperatorId = this.networkOperators[getOpItem]?.NetworkOperatorId;
        this.networkOperatorName = this.networkOperators[getOpItem]?.NetworkOperatorName.replace(" Home Fibre", "");
      }
    }

    if(this.networkOperatorId != null || this.networkOperatorId != undefined || this.networkOperatorId != "")
    {
          this.getNetworkOperatorProducts(this.networkOperatorId);
    }
  }
  changeAddressType(event){
    //console.log(event.target.value);
  }
  
  submitUserDetails(){

    console.log(this.serviceProvider);
    console.log(this.salesApplication.value);
    //this.fsCrud.saveUserDetails(this.userPersonalDetails.value);

    //

    //reset form
    this.ResetForm(); 
  }
}
