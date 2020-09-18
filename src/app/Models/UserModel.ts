export class UserPersonalDetails{
    public UserID: number;
    public FirstName: string;
    public LastName: string;
    public Email: string;
    public MobileNumber: string;
    public AddressDetails: AddresDetails;
}

export class AddresDetails{
    public AddressLine1: string;
    public AddressLine2: string;
    public City: string;
    public Province: string;
    public ZipCode: string;
    public Country: string = "South Africa";
    public AddressType: string; //FreeStanding, Complex, Estate
}
