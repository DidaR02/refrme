import { Injectable, NgZone } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat//firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from "@angular/router";
import { User, UserAccess } from "src/app/Models/userDetails/IUser";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: User; // Save logged in user data
 userAccess: UserAccess;

  constructor(public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public afsDb: AngularFireDatabase
    ) {
      if(this.isLoggedIn)
      {
        this.getLocalUserData();
      }
      else
      {
        this.router.navigate(['landing']);
      }
    }


        /*Set user return only CanLogin from FireStore instead of the Database UserAccess Table.
        Both userAccessTable and FireStore user table will sync this value on login and userprofile actions
        */
  SignIn(email: string, password: string) {
         return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    // Sign up with email/password
    async SignUp(user: User, password: string) {
      try {
        const result = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        if (result.user) {
          await this.SetFsUserData(user, result.user);
          await this.SetDbUserData(user, result);
          await this.SetUserAccess(result.user.uid);

          const newUser = localStorage.getItem('user');
          this.userData = newUser ? JSON.parse(newUser) : null;

          this.SendVerificationMail();
        }
      } catch (error) {
        window.alert(error);
      }
    }

    // Sign out
    SignOut(redirect: boolean = false) {
      this.afAuth.signOut().then(() => {
        localStorage.clear();
        if (redirect)
          {this.router.navigate(['home']);}
      });
    }

    // Send email verfificaiton when new user sign up
    async SendVerificationMail() {
      return this.afAuth.currentUser.then(verify => verify?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
    }

    // Reset Forggot password
    async ForgotPassword(passwordResetEmail: string) {
      if(passwordResetEmail)
      {
        return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email sent, check your inbox.');
        }).catch((error) => {
          window.alert(error)
        });
      }
      else{
        window.alert('Password reset email not sent, check your inbox. Please enter valid password.');
      }
    }

    // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {

    let getSignedInUder = localStorage.getItem('user');
    let isLoggedIn: boolean = false;

    if (getSignedInUder)
    {
      const user : User = JSON.parse(getSignedInUder);
      isLoggedIn = (user !== null && user.emailVerified !== false) ? true : false;
    }

    return isLoggedIn;
  }

  async isSignedInUsersEmailMatch(): Promise<boolean> {
    let isValidUser: boolean = false;
      await this.afAuth.currentUser.then((signedInUser) => {
        isValidUser = signedInUser?.email ? true : false;
      })
    return isValidUser;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    let getUser = localStorage.getItem('user');
    const user = JSON.parse(localStorage.getItem('user') as User | any);
    return (user.emailVerified !== false) ? true : false;
  }

    // Auth logic to run auth providers
    async AuthLogin(provider: any) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => {
         this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          })
        this.SetFsUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
    }

    /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  async SetFsUserData(user: any, userResults?: any) {
      if(user){
        if(userResults)
        {
          user.uid = userResults.uid;
        }

        if(user.firstName || user.lastName)
        {
          user.displayName = user.firstName.substring(0,1).toUpperCase() + ", " + user.lastName;
        }

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const userData: User = {
          uid: user.uid,
          email: user.email ?? null,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
          emailVerified: user.emailVerified ?? false,
          firstName: user.firstName?? null,
          lastName: user.lastName ?? null,
          promocode: user.promocode ?? null,
          referalPromoCode : user.referalPromoCode ?? null
        }
        await userRef.set(userData, {
          merge: true
        }).then(
          async (mergeFsComplete) =>
          {
            return true;
            }
        ).catch(
          (exception) =>
          {
            throw exception;
            }
        );
        return true;
      }
      else
      {
        console.log("merge firestore user not processed : No user was supplied");
      }
      return false;
    }

     async SetDbUserData(user: any, userResults?: any) {
       if (user) {
         if (userResults?.user) {
           user.uid = userResults.user.uid;
         }

         if (user.firstName || user.lastName) {
           user.displayName = user.firstName.substring(0, 1).toUpperCase() + ", " + user.lastName;
         }

         if (!user?.uid || user?.uid === "") {
           window.alert('Database Eroor: Cannot get user Id');
           return false;
         }

         const userData: User = {
           uid: user.uid,
           email: user.email ?? null,
           displayName: user.displayName ?? null,
           photoURL: user.photoURL ?? null,
           emailVerified: user.emailVerified ?? false,
           firstName: user.firstName ?? null,
           lastName: user.lastName ?? null,
           promocode: user.promocode ?? null,
           referalPromoCode : user.referalPromoCode ?? null
         }
         await this.afsDb.database.ref(`tb_user/${user.uid}`)
           .set(userData)
           .then(
             async () => {
               localStorage.setItem('user', JSON.stringify(userData));
               return true;
             }
           ).catch(
             async (exception) => {
               throw exception;
             }
           );
       }
      else
      {
         console.log("updating Db user not processed : No user was supplied");
         return false;
      }
      return true;
    }

    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
     async getLocalUserData() {

      return this.afAuth.authState.subscribe(async user => {
        if (user) {
          await this.GetUserAccess(user);
          await this.GetDbUserAccount(user);
          localStorage.setItem('signedInUser', JSON.stringify(user));
        } else {
          console.log("Failed at getLocalUserData method, no user found or no user loggedIn yet.\r\n Removing local data");
          localStorage.removeItem('user');
          localStorage.removeItem('signedInUser');
          localStorage.removeItem('userAccess');
        }
      })
    }

  async GetUserAccess(user: any): Promise<UserAccess>{
      if(user)
      {
        try
        {
          const userAccessObj = this.afsDb.database.ref('tb_userAccess/' + user?.uid);

          await userAccessObj.once('value')
            .then(async (useAccess) => {
              if (useAccess.val())
              {
                localStorage.setItem('userAccess', JSON.stringify(useAccess.val()));
                this.userAccess = useAccess.val();
              }
              return this.userAccess;
            }).catch(async (exception) =>
            {
              let errorMsg = "Failed to get user permissions :" + exception;
              console.log(errorMsg)
              throw exception;
          });
        }
        catch (error)
        {
          let errorMsg = "Permission Error :" + error;
          console.log(errorMsg)
          throw error;
        };
      }
      else
      {
        console.log("Get User Access failed : No user was supplied");
      }

      return this.userAccess;
    }

     async SetUserAccess(uid: string) : Promise<UserAccess>{
      if(uid)
      {
        if(!this.userAccess)
        {
          this.userAccess = {
            uid: uid,
            isAdmin: "false",
            canShareFeed: "false",
            canConnectPeers: "false",
            canChat: "false",
            canSubmitAllApplications: "false",
            viewAllSalesApplications: "true",
            canReferUsers: "false",
            salesTally: [],
            collectionsTarget: [],
            canViewUserDetailsPOPI: "false",
            brandAffiliateChoice: [],
            canAddFile: "false",
            canCreateFolder: "string",
            canDownload: "false",
            canShare: "false",
            canLogin: "true",
            disableView: [{"PageId": "6"}],
            canDelete: "false",
            adminAccessLevel: "partialAccess",
            partialAccess: []
          };
        }

        localStorage.setItem('userAccess', JSON.stringify(this.userAccess));

        await this.afsDb.database.ref('tb_userAccess/' + uid).set(this.userAccess)
          .then(async (setUserAccess) => {
            localStorage.setItem('userAccess', JSON.stringify(this.userAccess));
          })
          .catch(async (exception) => {
            let errorMsg = "setUserAccess Error :" + exception;
            console.log(errorMsg)
            throw exception
          });
       }
      else
      {
        console.log("Set User Access failed : No userId was supplied");
       }

       return this.userAccess;
    }

      async GetDbUserAccount(user: any) {

       let userAccount!: User ;
      if(user)
      {
        const getUserAccount = this.afsDb.database.ref('tb_user/' + user?.uid);

        await getUserAccount.once('value').then(
          async (snapshot) => {
            if (snapshot.val())
            {
              userAccount = snapshot.val() as User;
              localStorage.setItem('user', JSON.stringify(userAccount));
            }
        });
      }

      return userAccount as User;
    }
  }
