import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import {UserPersonalDetails,AddresDetails} from '../Models/UserModel'


@Injectable({
  providedIn: 'root'
})
export class FireBaseCrudService {

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private fireDb: AngularFireDatabase) { }

  public NetworkOperatorList: AngularFireList<any>;
  public ServiceProviderList: AngularFireList<any>;
  public NetworkOperatorProductList: AngularFireList<any>;

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
