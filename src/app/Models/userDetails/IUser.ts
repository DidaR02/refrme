export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    promocode: string;
 }

 export interface UserAccess {
    uid: string;
    isAdmin: string;
    canShareFeed: string;
    canConnectPeers: string;
    canChat: string;
    canSubmitAllApplications: string;
    viewAllSalesApplications: string;
    canReferUsers: string;
    salesTally: string[];
    collectionsTarget: string[];
    canViewUserDetailsPOPI: string;
    brandAffiliateChoice: string[];
    canAddFile: string;
    canCreateFolder: string;
    canDownload: string;
    canShare: string;
    canLogin: string;
    disableView: any[];
    canDelete: string;
    adminAccessLevel: string;
    partialAccess: PartialAccess[];
 }

 export interface PartialAccess{
     canDisableButtonActions: string;
     canLockFiles: string;
     canModifyUser: string;
     canRestrictUser: string;
     canSetAdminUser: string;
 }
