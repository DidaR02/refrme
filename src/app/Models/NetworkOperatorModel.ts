export class NetworkOperator{
    IsActive: boolean;
    NetworkOperatorId: string;
    NetworkOperatorName: string;
    NetworkOperatorNewInstallAmount: string;
    NetworkOperatorExistingInstallAmount: string;
}

export class NetworkOperatorProducts{
    ProdId : string;
    Download : string;
    Upload : string;
    PaymentTerms : string;
    ProdName : string;
    ProdPackage : string;
    ProdPrice : string;
    ProdSupport : string;
    RouterSupport : string;
}

export class ProductMessage{
    OperatorId: string;
    prodId: string;
    OperatorName: string;
    ProductMessage: string;
    InstallationAmount?: string;
    ActivationAmount?: string;
}