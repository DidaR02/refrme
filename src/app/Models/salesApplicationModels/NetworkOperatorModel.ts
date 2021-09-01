export class NetworkOperator{
    IsActive!: boolean;
    NetworkOperatorId!: string;
    NetworkOperatorName!: string;
    NetworkOperatorNewInstallAmount!: string;
    NetworkOperatorExistingInstallAmount!: string;
}

export class NetworkOperatorProducts{
    ProdId!: string;
    Download!: string;
    Upload!: string;
    PaymentTerms!: string;
    ProdName!: string;
    ProdPackage!: string;
    ProdPrice!: string;
    ProdSupport!: string;
    RouterSupport!: string;
}

export class ProductMessage{
  OperatorId: string = '';
  prodId: string = '';
  OperatorName: string = '';
  ProductMessage: string = '';
  InstallationAmount?: string = '';
  ActivationAmount?: string = '';
}

export class NetworkOperatorLTEProducts{
  MTNFixedLTEServices: MTNFixedLTEServices = new MTNFixedLTEServices();
}

export class MTNFixedLTEServices{
  Tier3LTEPacks: Tier3LTEPacks[];
  PricePercentage: PricePercentage[] = [];
  TopUpDataLTEPacks: TopUpDataLTEPacks[];
}

export class Tier3LTEPacks
{
  // LtePackId: string;
  DataService: DataService = new DataService();
  DataValidityInDays: number;
  PackageName: string;
  ResellerTier3CostPriceExVat: number;
  RRPIncVat: number;
  ResellerPriceIncVat: number;
  ResellerPriceExVat: number;
}

export class TopUpDataLTEPacks
{
  // TopUpPackId: string;
  DataService: DataService = new DataService();
  DataValidityInDays: number;
  PackageName: string;
  ResellerTier3CostPriceExVat: number;
  RRPIncVat: number;
  ResellerPriceIncVat: number;
  ResellerPriceExVat: number;
}

export class LTEPacks{
  // LtePackId: string;
  DataService: DataService = new DataService();
  DataValidityInDays: number;
  PackageName: string;
  ResellerTier3CostPriceExVat: number;
  RRPIncVat: number;
  ResellerPriceIncVat: number;
  ResellerPriceExVat: number;
}

export class DataService{
  AnyTime: number;
  NightTime: number
}

export class PricePercentage {
  percId: number;
  Percentage: number;
}
