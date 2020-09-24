import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import {UserPersonalDetails,AddresDetails} from '../Models/UserModel'
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireBaseCrudService {

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private fireDb: AngularFireDatabase) { }

  public NetworkOperatorList: AngularFireList<any>;
  public ServiceProviderList: AngularFireList<any>;
  public NetworkOperatorProductList: AngularFireList<any>;

  private filePath: string = "RefrMe/storage/VerificationDocuments/";
  private task: AngularFireUploadTask;
  private percentage: Observable<number>;
  public snapshot: Observable<any>;
  public downloadURL: Observable<string>;
  public metaData: any;
  private fileInfo: [Observable<string>, any];
  
  saveFile(file: File, path?: string, customMetadata?: any){
    if(file != null || file != undefined){
      
      const storagepath = path ? this.filePath + path +"/"+ file.name : this.filePath + file.name;
      
      const ref = this.fireStorage.ref(storagepath);

      this.task = this.fireStorage.upload(storagepath, file);//ref.put(file);

      this.percentage = this.task.percentageChanges();
      
      this.task.snapshotChanges().pipe(
        finalize(
          
          async () =>  {
          
          this.downloadURL = await this.fireStorage.ref(storagepath).getDownloadURL().toPromise();

          this.metaData = await this.fireStorage.ref(storagepath).getMetadata().toPromise();
          console.log("this.downloadURL",this.downloadURL);
          console.log("this.metaData",this.metaData);

          var findParentFromPath = this.metaData.fullPath.split('/');
          var getDocumentName = findParentFromPath[findParentFromPath.length -2];
     

          var metadata = {
            customMetadata: {
              'fileName': file.name,
              'filePath': this.filePath,
              'fullPath': this.metaData?.fullPath
            }
          }

          // await this.fireStorage.ref(path).updateMetadata(metadata).toPromise().then(
          //   function(metaData){
          //     newCustomMetaData = metaData;
          //   });
            
          //this.metaData = newCustomMetaData;

          //this.fileInfo = [this.downloadURL,this.metaData];
          
          //this.fireStore.collection(getDocumentName).add( {name: this.metaData.name, downloadURL: this.downloadURL, path: this.metaData.fullPath, fileType: this.metaData.type, timeCreated: this.metaData.timeCreated, metadata: this.metaData});
          
          alert('Upload Successful');

          }
        )
      ).toPromise();
    }
  }

  saveUserDetails(userDetails: UserPersonalDetails){
    if(userDetails)
    {
      
    }
  
    else{
      alert("Please enter applicant personal details!");
    }
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
