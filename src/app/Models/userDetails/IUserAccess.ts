export interface UserAccess {
    uid: string;
    isAdmin: string;
    canShareFeed: string;
    canConnectPeers: string;
    canChat: string;
    canSubmitAllApplications: string;
    displaySalesApplications: string;
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
    disableView: string[];
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
