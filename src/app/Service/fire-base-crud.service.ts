import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import {UserPersonalDetails,AddresDetails} from '../Models/UserModel'
import { SaleApplication } from '../Models/SalesApplicationModel'
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireBaseCrudService {

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private fireDb: AngularFireDatabase) { }

  public NetworkOperatorList: AngularFireList<any>;
  public ServiceProviderList: AngularFireList<any>;
  public UserPersonalDetailsList: AngularFireList<any>;
  public SalesApplicationList: AngularFireList<any>;
  public NetworkOperatorProductList: AngularFireList<any>;

  private filePath: string = "RefrMe/storage/VerificationDocuments/";
  private task: AngularFireUploadTask;
  private percentage: Observable<number>;
  public snapshot: Observable<any>;
  public downloadURL: Observable<string>;
  public metaData: any;
  
  saveFile(file: File, path?: string, documentInfo?: any, applicationId?: string){
    if(file != null || file != undefined){
      
      const storagepath = path ? this.filePath + path +"/"+ file.name : this.filePath + file.name;
      
      const ref = this.fireStorage.ref(storagepath);

      this.task = this.fireStorage.upload(storagepath, file);//ref.put(file);

      this.percentage = this.task.percentageChanges();

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

  saveUserDetails(userDetails: UserPersonalDetails){
    if(userDetails)
    {
      var userId = this.fireDb.database.ref().child('ApplicantDetails').push().key;
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

  saveSaleApplication(saleApplication: SaleApplication){
    if(saleApplication)
    {
      var saleApplicationId = this.fireDb.database.ref().child('SaleApplication').push().key;
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
}
