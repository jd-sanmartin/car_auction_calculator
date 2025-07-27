// I made this type in order to avoid the use of magic strings. I could also use a constant object I could use as a kind of enum
export type CarType = 'Common' | 'Luxury';

export interface BidFormData {
  basePrice: number;
  carType: CarType;
}

// Type of the response we get from the server on POST /calculate
export interface BidFormResponse {
  basePrice: number;
  basicBuyerFee: number;
  sellerSpecialFee: number;
  associationFee: number;
  storageFee: number;
  totalCost: number;
}

// .NET Data annotations return the error messages in PascalCase
// So I created this type to keep type safety and convert them to our own FormErrors type
// I probably should change what validations return in the backend, for now, I will keep it as is
export type FormErrorsFromServer = {
  BasePrice?: string[];
  CarType?: string[];
}

// This function couls be moved to a separate file for helpers
export function isFormErrorsFromServer(errors: any): errors is FormErrorsFromServer {
  return errors && (errors.BasePrice || errors.CarType);
}

export type FormErrors = Record<keyof BidFormData, string[]>;
