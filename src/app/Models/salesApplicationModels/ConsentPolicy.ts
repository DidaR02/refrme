export class ElectronicMandateTerms {
    ElectronicMandateTerm!: string;
    AmountAgreed!: string;
    PaymentTerms!: string;
    IsUserAgreed!: boolean;
    ElectronicMandateURL!: string;
}


export class TermsAndCondition{
    TermAndConditionName!: string;
    IsUserAgreed!: boolean;
    TermAndConditionURL!: string;
}


export class MarketingConsent {
    MarketingAgreement!: boolean;
    MarketingChannel!: string;
}
