import { NetworkOperator } from './NetworkOperatorModel';
import { ServiceProvider } from './ServiceProviderModel';
import { NetworkOperatorProducts } from './NetworkOperatorModel';
import { UserPersonalDetails} from './UserModel';
import { BankDetails} from './BankDetails';
import {FileElement} from './FileElement';

export class SaleApplication{
    public AgentPromoCode: string;
    public serviceProvider: ServiceProvider;
    public NetworkOperator: NetworkOperator;
    public NetworkOperatorPackage: NetworkOperatorProducts;
    public NetworkOperatorPackageInstall: NetworkOperatorProducts; //Yes and No
    public IsCpeFirbreInstalled: string;
    public UserPersonalDetails: UserPersonalDetails;
    public SpecialComments: string;
    public DeliveryInstallOption: string;
    public BillingBankDetails: BankDetails;
    public VerificationDocuments: FileElement[];
    public DebitOrderMandateAccepted: boolean;
    public TermsAndConditionsAccepted: boolean;
    public MarketingConsent: boolean;
    public ApplicationFeedback: string;
}