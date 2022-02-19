import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkOperator, NetworkOperatorProducts, ProductMessage, NetworkOperatorLTEProducts, MTNFixedLTEServices, LTEPacks, PricePercentage, DataService, Tier3LTEPacks, TopUpDataLTEPacks } from 'src/app/Models/salesApplicationModels/NetworkOperatorModel';
import { SaleApplication } from 'src/app/Models/salesApplicationModels/SalesApplicationModel';
import { ServiceProvider } from 'src/app/Models/salesApplicationModels/ServiceProviderModel';
import { UserPersonalDetails, AddresDetails } from 'src/app/Models/salesApplicationModels/UserModel';
import { PageDisplayList, DisableView } from 'src/app/Models/Settings/IPageDisplaySettings';
import { SignedInUser } from 'src/app/Models/userDetails/ISignedInUser';
import { User, UserAccess } from 'src/app/Models/userDetails/IUser';
import { AuthenticationService } from 'src/app/Service/authentication/authentication.service';
import { FireBaseCrudService } from 'src/app/Service/authentication/fire-base-crud.service';
import { UserManagerService } from 'src/app/Service/authentication/userManager.service';
import { DataTypeConversionService } from 'src/app/Service/shared/dataType-conversion.service';


@Component({
  selector: 'app-sales-application-form',
  templateUrl: './sales-application-form.component.html',
  styleUrls: ['./sales-application-form.component.scss']
})
export class SalesApplicationFormComponent implements OnInit {
  title = 'RefrMe';
  networkOperators: NetworkOperator[] = [];
  serviceProviders: ServiceProvider[] = [];
  serviceProvider: ServiceProvider = new ServiceProvider();
  networkOperatorProducts: NetworkOperatorProducts[] | any;
  productListMessage: ProductMessage[] = [];
  networkOperatorId: string = "";
  networkOperatorName: string = "";

  servProvId: string = "1";
  servProvName: string = "RefrMe";

  showPackages: boolean = true;

  @Input() AddressType: FormControl = new FormControl();
  @Input() DeliveryInstallOption: FormControl = new FormControl();

  verificationDocuments: File[] = [];

  createFileElementTagName  = new Map<string, File>();
  message = new ProductMessage();

  salesApplicationsList: SaleApplication[] = [];
  @Input() applicationFormState: string ="newSales";
  showHeader: boolean = true;
  @Input() saleApplicationId?: any;
  @Input() userId : string = '';
  disableDetailsEdit: boolean = true;
  user: User;
  userAccess: UserAccess;

  signedInUser: SignedInUser

  viewPage = true;
  submitOwnApplications = true;

  displayPages: PageDisplayList[] = [];
  private pageName: string = 'salesApplications';

  networkOperatorLTEProducts: NetworkOperatorLTEProducts;
  mtnFixedLTEServices: MTNFixedLTEServices = new MTNFixedLTEServices();
  lTEPacks: LTEPacks[] = [];
  lTEPricePercentage: PricePercentage[] = [];
  dataService: DataService[] = [];
  switchProducts: string;
  lteProducts: any;
  tier3LTEPacks: Tier3LTEPacks[] = [];
  tier3LTEPackageType: string;
  topUpDataLTEPacks: TopUpDataLTEPacks [] = [];

  constructor(
    public fsCrud: FireBaseCrudService,
    public formBuilder: FormBuilder,
    public userManagerService: UserManagerService,
    public authService: AuthenticationService,
    public convertDataType: DataTypeConversionService
  ) {

    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1)
    {
      this.fsCrud.getDisaplayPages();
    }
  }

  ngOnInit() {
    this.getUserInfo();
    this.displaySalesAppType();
    this.getNetworkOperator();
    this.getServiceProviders();
    this.setHeader();
    this.getSalesApplications();
    // this.getOperatorLTEProducts();
    this.getMTNFixedLTEServices()
  }

  async getUserInfo()
  {
    let displayPageList = JSON.parse(localStorage.getItem('displayPages') as PageDisplayList | any);
    if (!displayPageList || displayPageList.length < 1)
    {
      this.fsCrud.getDisaplayPages();
    }
    else
    {
      this.displayPages = displayPageList;
    }

    this.userManagerService.createSignInUser();

    if(this.authService?.isLoggedIn)
    {
      if(!this.userAccess)
      {
        //this.authService.getLocalUserData();
        this.userManagerService.createSignInUser();
      }

      if(this.authService?.userAccess)
      {
        this.userAccess = this.authService?.userAccess;
      }

      if(this.userAccess)
      {
        //if user cant view dashboard, redirect user to no access page.
     if(this.userAccess?.disableView)
        {
          let salesAppAccess: DisableView[] = this.userAccess?.disableView;

          if (this.displayPages.length < 1)
          {
            this.fsCrud.getDisaplayPages();
          }

          if (this.displayPages.length > 1)
          {
            let getAllowedPage = this.displayPages.find(x => x.PageName === this.pageName)

            for (var i = 0; i < salesAppAccess.length; i++)
            {
              if (getAllowedPage?.PageId.toString() === salesAppAccess[i]?.PageId)
              {
                this.viewPage = false;
                break;
              }
            }
          }
        }
      }

      if(this.userManagerService.user){
        this.user = {
          uid: this.userManagerService.user?.uid,
          displayName: this.userManagerService.user?.displayName,
          email: this.userManagerService.user?.email,
          emailVerified: this.userManagerService.user?.emailVerified,
          photoURL: this.userManagerService.user?.photoURL,
          firstName: this.userManagerService.user?.firstName,
          lastName: this.userManagerService.user?.lastName,
          promocode: this.userManagerService.user?.promocode,
          referalPromoCode: this.userManagerService.user?.referalPromoCode
        };

        this.signedInUser = {
          Uid: this.userManagerService.user?.uid,
          User: this.user,
          UserAccess: this.userAccess
        };

        localStorage.setItem('signedInUser', JSON.stringify(this.signedInUser));
        }
        else
        {
          if(!this.signedInUser || !this.signedInUser.Uid || !this.signedInUser.User || !this.signedInUser.User.uid || !this.signedInUser.UserAccess)
          {
            this.userManagerService.createSignInUser();
          }
        }
    }
  }

  async displaySalesAppType()
  {
    this.userManagerService.createSignInUser();

    if(this.authService?.isLoggedIn)
    {
      if(!this.userAccess)
      {
        //this.authService.getLocalUserData();
        this.userManagerService.createSignInUser();
      }

      if(this.authService?.userAccess)
      {
        this.userAccess = this.authService?.userAccess;
      }

      if(this.userAccess?.canSubmitAllApplications)
      {
        if(this.convertDataType.getBoolean(this.userAccess?.canSubmitAllApplications))
        {
          this.submitOwnApplications = false;
        }
      }

      if(this.userManagerService.user){
        this.user = {
          uid: this.userManagerService.user?.uid,
          displayName: this.userManagerService.user?.displayName,
          email: this.userManagerService.user?.email,
          emailVerified: this.userManagerService.user?.emailVerified,
          photoURL: this.userManagerService.user?.photoURL,
          firstName: this.userManagerService.user?.firstName,
          lastName: this.userManagerService.user?.lastName,
          promocode: this.userManagerService.user?.promocode,
          referalPromoCode: this.userManagerService.user?.referalPromoCode
        };

        this.signedInUser = {
          Uid: this.userManagerService.user?.uid,
          User: this.user,
          UserAccess: this.userAccess
        };

        localStorage.setItem('signedInUser', JSON.stringify(this.signedInUser));
        }
        else
        {
          if(!this.signedInUser || !this.signedInUser.Uid || !this.signedInUser.User || !this.signedInUser.User.uid || !this.signedInUser.UserAccess)
          {
            this.userManagerService.createSignInUser();
          }
        }
    }
  }

  setHeader(){
    if(this.applicationFormState?.length > 0)
    {
      switch(this.applicationFormState){
        case "newSales": {
          this.showHeader = true;
          break;
        }
        case "editSales": {
          this.showHeader = false;
          break;
        }
      }
    }
  }

   async getSalesApplications(){
    if(this.applicationFormState?.length > 0 && this.applicationFormState === "editSales")
    {
       await this.getSalesApplicationsList(this.submitOwnApplications);
     }
     else
    {
      this.salesApplication.patchValue({
        AgentPromoCode: this.user?.promocode?.toString()
      });
      }
  }

  getNetworkOperator(){
    let netOpList = this.fsCrud.getNetworkOperator();
    netOpList.snapshotChanges().subscribe(
      data =>{
        this.networkOperators = [];
        data.forEach( item =>{
          let operator: any = item.payload.toJSON();
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
    AddressLine1: new FormControl('',Validators.required),
    AddressLine2: new FormControl(),
    City: new FormControl('',Validators.required),
    Province: new FormControl(),
    PostalCode: new FormControl('', Validators.required),
    Suburb: new FormControl(),
    AddressType: new FormControl(this.AddressType.value) //FreeS
  });

  public userPersonalDetails = new FormGroup({
    FirstName: new FormControl('',Validators.required),
    LastName: new FormControl('',Validators.required),
    IdNumber: new FormControl('',Validators.required),
    Email: new FormControl('',Validators.required),
    MobileNumber: new FormControl('',Validators.required),
    AddressDetails: new FormGroup(this.addressDetails.controls),
    SpecialComments: new FormControl()
  });

  public deliveryInstallOption = new FormGroup({
    DeliveryInstallOption: new FormControl(this.DeliveryInstallOption.value, Validators.required)
  });

  //private serviceProviderB: ServiceProvider = this.serviceProvider[this.serviceProvider.findIndex(x => x.ServiceProviderId === this.servProvId)];
  public billingBankDetails = new FormGroup({
    AccountName: new FormControl('',Validators.required),
    BankName: new FormControl('',Validators.required),
    BranchName: new FormControl('',Validators.required),
    BranchCode: new FormControl('',Validators.required),
    AccountNumber: new FormControl('',Validators.required),
    AccountType: new FormControl('',Validators.required)
  });

  public salesApplication = new FormGroup({
    AgentPromoCode: new FormControl(),
    NetworkOperator: new FormControl(),
    LtePackageDeal: new FormControl(),
    LtePackageDealType: new FormControl(),
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
    this.verificationDocuments = [];
    this.createFileElementTagName = new Map<string, File>();
  }
  onfibreInstalledSelected(event: any)
  {
    let selecteValue = event.target.value;
    if(selecteValue === "No. I need Fibre installed into my home.")
    {
      this.showPackages = false;
    }
    else
    {
      this.showPackages = true;
    }
  }
  onSelectedNetworkOperator(event: any){
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

  changeAddressType(event: any){
    //console.log(event.target.value);
  }

  getIdentityDocumentFile(event: any) {
    this.createFileElementTagName.set("IdentityDocument",event.target.files[0]);
  }

  getProofOfResidence(event: any) {
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

    if (this.tier3LTEPackageType === "SimAndRouter")
    {
      saleApplication.LtePackageDealType = this.tier3LTEPackageType
    }

    let promoCode = formDetails?.AgentPromoCode;
    if (this.submitOwnApplications && (promoCode != this.user.promocode))
    {
      window.alert("Submitting other applications is not allowed.");
      return;
    }

    if(userPersonalDetails || saleApplication)
    {
       //if(this.applicationFormState === "newSales") {
         //Check if user exist before storing new user details.
          this.fsCrud.saveUserDetails(userPersonalDetails, this.userId);
       //}

      this.fsCrud.saveSaleApplication(saleApplication, this.saleApplicationId);
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

  private async getSalesApplicationsList(getOwnSalesApplications: boolean = false){

    let salesList = this.fsCrud.getSalesApplicationList();
      salesList.snapshotChanges().subscribe(
      dataList => {
        this.salesApplicationsList = [];
        dataList.forEach(saleApplication => {
          let a: any = saleApplication.payload.toJSON();
          a['SaleApplicationId'] = saleApplication.key;
          this.salesApplicationsList.push(a as SaleApplication);
        });

          if (getOwnSalesApplications)
          {
            this.salesApplicationsList = this.salesApplicationsList.filter(x => x.AgentPromoCode === this.user.promocode);
          }
        this.prePopulateSalesFormData(this.saleApplicationId);
      }
    );
  }

  private async prePopulateSalesFormData(saleAppId?: any){

    if((this.applicationFormState === "editSales") && (this.salesApplicationsList && this.salesApplicationsList.length > 0))
    {
      this.salesApplicationsList.forEach( entries => {

         if (entries.SaleApplicationId === saleAppId?.toString() )
        {
          this.salesApplication.patchValue({
            AgentPromoCode: entries.AgentPromoCode?.toString() ?? this.user?.promocode?.toString(),
            LtePackageDeal: entries.LtePackageDeal?.toString(),
            LtePackageDealType: entries.LtePackageDealType?.toString(),
            NetworkOperator: entries.NetworkOperator?.toString(),
            IsCpeFirbreInstalled: entries.IsCpeFirbreInstalled?.toString(),
            NetworkOperatorPackage: entries.NetworkOperatorPackage?.toString(),
            UserPersonalDetails: {
              FirstName: entries.UserPersonalDetails.FirstName?.toString(),
              LastName: entries.UserPersonalDetails.FirstName?.toString(),
              IdNumber: entries.UserPersonalDetails.IdNumber?.toString(),
              Email: entries.UserPersonalDetails.Email?.toString(),
              MobileNumber: entries.UserPersonalDetails.MobileNumber?.toString(),
              AddressDetails: entries.UserPersonalDetails.AddressDetails,
              SpecialComments: entries.UserPersonalDetails.SpecialComments?.toString()
            },
            AddressDetails: {
              AddressLine1: entries.AddressDetails.AddressLine1?.toString(),
              AddressLine2: entries.AddressDetails.AddressLine2?.toString(),
              City:  entries.AddressDetails.City?.toString(),
              Province:  entries.AddressDetails.Province?.toString(),
              ZipCode:  entries.AddressDetails?.PostalCode?.toString(),
              Suburb:  entries.AddressDetails.Suburb?.toString(),
              AddressType:  entries.AddressDetails.AddressType?.toString() //FreeS
            },
            ApplicationFeedback: entries.ApplicationFeedback?.toString(),
            DeliveryInstallOption: entries.DeliveryInstallOption?.toString(),
            BillingBankDetails: {
              AccountName: entries.BillingBankDetails?.AccountName?.toString(),
              BankName: entries.BillingBankDetails?.BankName?.toString(),
              BranchName: entries.BillingBankDetails?.BranchName?.toString(),
              BranchCode: entries.BillingBankDetails?.BranchCode?.toString(),
              AccountNumber: entries.BillingBankDetails?.AccountNumber?.toString(),
              AccountType: entries.BillingBankDetails?.AccountType?.toString()
            },
            //ProofOfIdentityDoc: new FormControl(),
            //ProofOfResidenceDoc: new FormControl(),
            DebitOrderMandateAccepted: entries.DebitOrderMandateAccepted,
            TermsAndConditionsAccepted: entries.TermsAndConditionsAccepted,
            MarketingConsent: entries.MarketingConsent,
          });

           this.tier3LTEPackageType = entries.LtePackageDealType?.toString();
        }
      });

      this.disableDetailsEdit = true;
    }
    else
    {
      this.salesApplication.patchValue({
        AgentPromoCode: this.user?.promocode?.toString(),
      });
      }
  }

  onPackageDealSelected(event: any)
  {
    if (event || event.target)
    {
      if (event?.target?.value === "fibre")
      {
        this.switchProducts = "fibre"
      }
      if (event?.target?.value === "lte")
      {
        this.switchProducts = "lte"

      }
    }
  }

  getOperatorLTEProducts()
  {
    let networkLTEProductsList = this.fsCrud.getOperatorLTEProducts();
    networkLTEProductsList.snapshotChanges().subscribe(
      myList => {
        this.networkOperatorLTEProducts = new NetworkOperatorLTEProducts();

        myList.forEach(lteProducts => {

          let lteProds: any = lteProducts.payload.toJSON();

          switch (lteProducts.key) {
            case "MTNFixedLTEServices":
              {
                this.mtnFixedLTEServices = lteProds;
                break;
              }
          }
        });
        this.setLTEProducts();
      }
    );
  }
  getMTNFixedLTEServices() {
    let mtnServes = this.fsCrud.getMTNFixedLTEServices()
      mtnServes.snapshotChanges().subscribe(
      serves => {
          serves.forEach(
            collection => {
              let collectopData = collection.payload.val();
              switch (collection.key) {
                case "PricePercentage":
                  {
                    if (collectopData.length > 0) {
                      for (var item = 0; item <= collectopData.length - 1; item++) {
                        if (collectopData[item]) {
                          this.lTEPricePercentage.push(collectopData[item]);
                        }
                      }
                    }
                    break;
                  }

                case "Tier3LTEPacks":
                  {
                    if (collectopData.length > 0) {
                      for (var item = 0; item <= collectopData.length - 1; item++) {
                        if (collectopData[item]) {

                          //Set prices on the package name for drop downlist and application purpose
                          collectopData[item]['PackageName'] = collectopData[item]['PackageName'] + " @ R " + collectopData[item]['ResellerPriceIncVat'].toString();

                          this.tier3LTEPacks.push(collectopData[item]);
                        }
                      }
                    }
                    break;
                  }

                case "TopUpDataLTEPacks":
                  {
                    if (collectopData.length > 0) {
                      for (var item = 0; item <= collectopData.length - 1; item++) {
                        if (collectopData[item]) {
                          this.topUpDataLTEPacks.push(collectopData[item]);
                        }
                      }
                    }
                    break;
                  }
              }
            });
        });
}
  setLTEProducts() {
    if (this.mtnFixedLTEServices) {
      if (this.mtnFixedLTEServices?.PricePercentage) {
        this.lTEPricePercentage = []
        this.lTEPricePercentage = this.mtnFixedLTEServices.PricePercentage;
      }
      if (this.mtnFixedLTEServices?.Tier3LTEPacks) {
        this.tier3LTEPacks = []
        this.tier3LTEPacks = this.mtnFixedLTEServices.Tier3LTEPacks;
      }
      if (this.mtnFixedLTEServices?.TopUpDataLTEPacks) {
        this.topUpDataLTEPacks = []
        this.topUpDataLTEPacks =this.mtnFixedLTEServices.TopUpDataLTEPacks;
      }
    }
  }

  onSelectTier3LTEPacks(event: any) {
    if (event?.target?.value) {
      let packs = event?.target?.value;
      this.tier3LTEPacks.forEach(x => {
        if (x.PackageName === packs) {
          this.tier3LTEPackageType = x.PackageType.toString();
          return;
        }
      });
    }
  }
}
