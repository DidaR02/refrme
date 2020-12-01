import {NetworkOperator} from './NetworkOperatorModel'

export class ServiceProvider{
    ServiceProviderId: string;
    ServiceProviderName: string;
    IsActive: boolean;
}

export class UserServiceProvider{
    ServiceProvider: ServiceProvider;
    NetworkOperator: NetworkOperator;
}