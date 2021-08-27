import { NetworkOperator } from "./NetworkOperatorModel";

export class ServiceProvider{
    ServiceProviderId: string = '';
    ServiceProviderName: string = '';
    IsActive: boolean = false;
}

export class UserServiceProvider{
    ServiceProvider: ServiceProvider = new ServiceProvider;
    NetworkOperator: NetworkOperator = new NetworkOperator;
}
