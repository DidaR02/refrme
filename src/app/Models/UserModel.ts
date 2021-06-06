export class UserPersonalDetails{
  public UserID: number = 0;
  public FirstName: string = '';
  public LastName: string = '';
  public IdNumber: string = '';
  public Email: string = '';
  public MobileNumber: string = '';
  public AddressDetails: AddresDetails = new AddresDetails();
  public SpecialComments: string = '';
}

export class AddresDetails{
  public AddressLine1: string = '';
  public AddressLine2: string = '';
  public Suburb: string = '';
  public City: string = '';
  public Province: string = "Limpopo";
  public PostalCode: string = '';
  public Country: string = "South Africa";
  public AddressType: string = ''; //FreeStanding, Complex, Estate
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
 }
