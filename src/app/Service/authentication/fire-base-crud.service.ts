import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import {UserPersonalDetails} from './../../models/salesApplicationModels/UserModel'
import { SaleApplication } from './../../models/salesApplicationModels/SalesApplicationModel'
import { Observable} from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PageDisplayList } from 'src/app/models/Settings/IPageDisplaySettings';

@Injectable({
  providedIn: 'root'
})
export class FireBaseCrudService {

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private fireDb: AngularFireDatabase) {
  }

  public NetworkOperatorList!: AngularFireList<any>;
  public ServiceProviderList!: AngularFireList<any>;
  public UserPersonalDetailsList!: AngularFireList<any>;
  public SalesApplicationList!: AngularFireList<any>;
  public NetworkOperatorProductList!: AngularFireList<any>;
  public NetworkOperatorLTEProductsList!: AngularFireList<any>;
  public DisplayPagesList!: AngularFireList<any>;
  private displayPages: PageDisplayList[] = []
  private filePath: string = "RefrMe/storage/VerificationDocuments/";
  private task!: AngularFireUploadTask;
  public snapshot!: Observable<any>;
  public downloadURL!: Observable<string>;
  public metaData: any;

  saveFile(file: File, path?: string, documentInfo?: any, applicationId?: string){
    if(file != null || file != undefined){

      const storagepath = path ? this.filePath + path +"/"+ file.name : this.filePath + file.name;

      const ref = this.fireStorage.ref(storagepath);

      this.task = this.fireStorage.upload(storagepath, file);//ref.put(file);

      var newCustomMetaData: any = null;

      this.task.snapshotChanges().pipe(
        finalize(

          async () =>  {

          this.downloadURL = await this.fireStorage.ref(storagepath).getDownloadURL().toPromise();

          this.metaData = await this.fireStorage.ref(storagepath).getMetadata().toPromise();

          var findParentFromPath = this.metaData.fullPath.split('/');
          var getDocumentName = findParentFromPath[findParentFromPath.length -2];


          var metadata = {
            customMetadata: {
              'filePath': this.filePath,
              'fullPath': this.metaData?.fullPath,
              'documentInfo': documentInfo? documentInfo : "",
              'applicationId': applicationId? applicationId: ""
            }
          }

          await this.fireStorage.ref(storagepath).updateMetadata(metadata).toPromise().then(
             function(returnMetaData){
               newCustomMetaData = returnMetaData;
             });
          this.metaData  = newCustomMetaData;

          this.fireStore.collection(getDocumentName).add( {
            name: this.metaData.name,
            downloadURL: this.downloadURL,
            path: this.metaData.fullPath,
            fileType: this.metaData.type,
            timeCreated: this.metaData.timeCreated,
            metadata: {
              'filePath': this.filePath,
              'fullPath': this.metaData?.fullPath,
              'documentInfo': documentInfo? documentInfo : "",
              'contentType': this.metaData?.contentType,
              'type': this.metaData?.type,
              'applicationId': applicationId? applicationId: ""
            },
            additionalMetadata: metadata
            });

          }
        )
      ).toPromise();
    }
  }

  saveUserDetails(userDetails: UserPersonalDetails, userId: string){
    if(userDetails)
    {
      userId = userId ?? this.fireDb.database.ref().child('ApplicantDetails').push().key;
      this.fireDb.database.ref('ApplicantDetails/' + userId).set(userDetails, function(error) {
        if (error) {
          alert("Data saved failed! \n" + error);
        } else {
          alert("Data saved successfully!");
        }
      });
    }
    else{
      alert("Please enter applicant personal details!");
    }
  }

  saveSaleApplication(saleApplication: SaleApplication, saleApplicationId: string){
    if(saleApplication)
    {
      saleApplicationId =  saleApplicationId ?? this.fireDb.database.ref().child('SaleApplication').push().key;
      this.fireDb.database.ref('SaleApplication/' + saleApplicationId).set(saleApplication, function(error) {
        if (error) {
          alert("Save SaleApplication failed! \n" + error);
        } else {
          alert("Save SaleApplication Data saved successfully!");
        }
      });
    }
    else{
      alert("Please enter SaleApplication details!");
    }
  }

  getUserDetailsList(userId: string) {
    let userDetails = this.fireDb.database.ref('ApplicantDetails/' + userId).toJSON();
    console.log("userDetails", userDetails);
    return userDetails;
  }

   getSalesApplicationList() {
    this.SalesApplicationList = this.fireDb.list('SaleApplication');
    return this.SalesApplicationList;
  }

  getNetworkOperator(){
      this.NetworkOperatorList = this.fireDb.list('NetworkOperator');
      return this.NetworkOperatorList;
    };

    getServiceProvider(){
      this.ServiceProviderList = this.fireDb.list('ServiceProvider');
      return this.ServiceProviderList;
    };

    getNetworkOperatorProducts()
    {
      this.NetworkOperatorProductList = this.fireDb.list('NetworkOperatorProducts');
      return this.NetworkOperatorProductList;
  }

  getDisaplayPages()
    {
      this.DisplayPagesList = this.fireDb.list('tb_displayPages');
      this.DisplayPagesList.snapshotChanges().subscribe(
        (displayPageList) => {

          this.displayPages = [];

          displayPageList.forEach(pages => {
            let dp = pages.payload.toJSON();
            if (dp) {
              let currentPage = dp as PageDisplayList;
              if (currentPage.IsEnabled) {
                this.displayPages.push(dp as PageDisplayList);
              }
            }
          });

          //set on local storage
          if (this.displayPages.length > 0)
              localStorage.setItem("displayPages", JSON.stringify(this.displayPages));
        });
  }

  getLTEProducts() {
    this.NetworkOperatorLTEProductsList = this.fireDb.list('NetworkOperatorLTEProducts');
    return this.NetworkOperatorLTEProductsList;
  }
}
