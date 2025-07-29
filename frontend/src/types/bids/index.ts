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

export type FormErrors = Record<keyof BidFormData, string[]>;

// This function could be moved to a separate file for helpers
export function isFormError(errors: any): errors is FormErrors {
  return errors && (errors.basePrice || errors.carType);
}

