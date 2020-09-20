import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

import {UserPersonalDetails,AddresDetails} from '../Models/UserModel'


@Injectable({
  providedIn: 'root'
})
export class FireBaseCrudService {

  constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private fireDb: AngularFireDatabase) { }

  saveUserDetails(userDetails: UserPersonalDetails){
    if(userDetails)
    {
      
    }
  
    else{
      alert("Please enter applicant personal details!");
    }
  }

}
