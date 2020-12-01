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
  serviceProviders: ServiceProvider[] = [];
  serviceProvider: ServiceProvider = null;
  networkOperatorProducts: NetworkOperatorProducts[];
  productListMessage: ProductMessage[] = [];
  networkOperatorId: string = "";
  networkOperatorName: string = "";

  servProvId: string = "1";
  servProvName: string = "RefrMe";
  
  @Input() AddressType: FormControl = new FormControl();
  @Input() DeliveryInstallOption: FormControl = new FormControl();

  verificationDocuments: File[] = [];
  
  createFileElementTagName  = new Map<string, File>();
  message = new ProductMessage();

  constructor(public fsCrud: FireBaseCrudService, public formBuilder: FormBuilder){}

  ngOnInit(){
    this.getNetworkOperator();
    this.getServiceProviders();
    
    
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

                this.message = new ProductMessage();
                this.message.OperatorId = this.networkOperatorId;
                this.message.prodId = this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdId'];
                this.message.OperatorName = this.networkOperatorName;
                this.message.InstallationAmount= this.networkOperators[parseInt(this.networkOperatorId)-1]?.NetworkOperatorNewInstallAmount;
                this.message.ActivationAmount = this.networkOperators[parseInt(this.networkOperatorId)-1]?.NetworkOperatorExistingInstallAmount
                this.message.ProductMessage = this.buildNetworkOperatorProductListMessage(this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdName'],
                
                this.networkOperatorProducts[prodList]['Products'][prodItem]['Download'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['Upload'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['ProdPrice'],
                this.networkOperatorProducts[prodList]['Products'][prodItem]['PaymentTerms'],
                this.message.InstallationAmount,
                this.message.ActivationAmount);
                
                this.productListMessage.push(this.message as ProductMessage);
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

    var message = this.networkOperatorName + " " + productName + " " + download +"Mbps Download and "+ upload +"Mbps Upload: R"+amount+ " " +payMentTerms.Monthly+ " (New Installation and Activation " + (installAmount === 'FREE'? " is free": installAmount?.toString().startsWith('R',0)? installAmount : "R" + installAmount) +") - (Existing Installation activation " + (existInstallAmount === 'FREE'? " is free": existInstallAmount?.toString().startsWith('R',0)? existInstallAmount : "R" + existInstallAmount) +")";
    return message;
  }

  getServiceProviders(){
    let getServiceProviderpList = this.fsCrud.getServiceProvider();
    getServiceProviderpList.snapshotChanges().subscribe(
      data =>{
        this.serviceProviders = [];
        data.forEach( item =>{
          let sp = item.payload.toJSON();
          if(sp)
          {
            this.serviceProviders.push(sp as ServiceProvider);
          }
        });
        this.getServiceProvider();
      }
    );

    
  };

  getServiceProvider()
  {
    
    if(this.serviceProviders)
    {
      for(var sp = 0 ; sp <= this.serviceProviders.length; sp++)
      {
        if(this.serviceProviders[sp]?.ServiceProviderId == this.servProvId && this.serviceProviders[sp]?.ServiceProviderName === this.servProvName)
        {
          this.serviceProvider = this.serviceProviders[sp];
        }
      }
    }
  }
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
  public billingBankDetails = new FormGroup({
    AccountName: new FormControl(),
    BankName: new FormControl(),
    BranchName: new FormControl(),
    BranchCode: new FormControl(),
    AccountNumber: new FormControl(),
    AccountType: new FormControl()
  });

  public salesApplication = new FormGroup({
    AgentPromoCode: new FormControl(),
    NetworkOperator: new FormControl(),
    IsCpeFirbreInstalled: new FormControl(),
    NetworkOperatorPackage: new FormControl(),
    UserPersonalDetails: new FormGroup(this.userPersonalDetails.controls),
    AddressDetails: new FormGroup(this.addressDetails.controls),
    ApplicationFeedback: new FormControl(),
    DeliveryInstallOption: new FormControl(),
    BillingBankDetails: new FormGroup(this.billingBankDetails.controls),
    ProofOfIdentityDoc: new FormControl(),
    ProofOfResidenceDoc: new FormControl(),
    DebitOrderMandateAccepted: new FormControl(),
    TermsAndConditionsAccepted: new FormControl(),
    MarketingConsent: new FormControl(),
  });

  ResetForm() {
    this.salesApplication.reset();
    this.userPersonalDetails.reset();
    this.verificationDocuments = null;
    this.createFileElementTagName = null;
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
  
  getIdentityDocumentFile(event) {
    this.createFileElementTagName.set("IdentityDocument",event.target.files[0]);
  }

  getProofOfResidence(event) {
    this.createFileElementTagName.set("ProofOfResidence",event.target.files[0]);
  }

  saveFile(uploadFiles?: File, additionalAttributesObject?: any)
  {
    if(uploadFiles != null || uploadFiles != undefined){
        this.fsCrud.saveFile(uploadFiles,undefined,additionalAttributesObject);
    }
  }

  submitUserDetails(){

    var formDetails = this.salesApplication.value;
    var userPersonalDetails: UserPersonalDetails = formDetails?.UserPersonalDetails;
    var addressDetails: AddresDetails = formDetails?.AddressDetails;
    userPersonalDetails.AddressDetails = addressDetails;

    var saleApplication: SaleApplication = formDetails;

    if(userPersonalDetails || saleApplication)
    {
      this.fsCrud.saveUserDetails(userPersonalDetails);
      this.fsCrud.saveSaleApplication(formDetails);
      if(this.createFileElementTagName != null || this.createFileElementTagName != undefined){
        //Iterate over map keys  
        for (let fileElementTag of this.createFileElementTagName.entries()) {  
            this.saveFile(fileElementTag[1], fileElementTag[0]);
        }  
      }
    }
    else{
      alert("Please enter applicantion details.");
      return;
    }

    this.ResetForm(); 
  }
}
