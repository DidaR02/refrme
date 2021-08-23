import { NamedTupleMember } from "typescript";

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
  ProdId: number;
  FixedLTEServices: FixedLTEServices;
}

export class FixedLTEServices{
  ServiceId: number;
  LTEPacks: LTEPacks;
  LTEPricePercentage: LTEPricePercentage;
}

export class LTEPacks{
  PrackId: number;
  LTEPackDetails: LTEPackDetails;
}

export class LTEPackDetails{
  DataService: DataService;
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

export class LTEPricePercentage {
  percId: number;
  Percentage: number;
}
