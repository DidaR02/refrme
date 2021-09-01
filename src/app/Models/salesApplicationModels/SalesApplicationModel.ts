import { FileElement } from "../file-element/file-element";
import { BankDetails } from "./BankDetails";
import { NetworkOperator, NetworkOperatorProducts } from "./NetworkOperatorModel";
import { ServiceProvider } from "./ServiceProviderModel";
import { UserPersonalDetails, AddresDetails } from "./UserModel";

export class SaleApplication{
    public SaleApplicationId!: string;
    public AgentPromoCode!: string;
    public LtePackageDeal!: string;
    public serviceProvider!: ServiceProvider;
    public NetworkOperator!: NetworkOperator;
    public NetworkOperatorPackage!: NetworkOperatorProducts;
    public NetworkOperatorPackageInstall!: NetworkOperatorProducts; //Yes and No
 //Yes and No
    public IsCpeFirbreInstalled!: string;
    public UserPersonalDetails!: UserPersonalDetails;
    public AddressDetails!: AddresDetails;
    public DeliveryInstallOption!: string;
    public BillingBankDetails!: BankDetails;
    public VerificationDocuments!: FileElement[];
    public DebitOrderMandateAccepted!: boolean;
    public TermsAndConditionsAccepted!: boolean;
    public MarketingConsent!: boolean;
    public ApplicationFeedback!: string;
}
