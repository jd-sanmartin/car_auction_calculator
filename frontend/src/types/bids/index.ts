export const CarTypeEnum = {
  Common: 0,
  Luxury: 1,
} as const;

export type CarTypeId = (typeof CarTypeEnum)[keyof typeof CarTypeEnum];
export type CarTypeName = keyof typeof CarTypeEnum;

// Response from server on GET /car-types
export type CarType = {
  id: CarTypeId;
  name: CarTypeName;
}

export interface BidFormData {
  basePrice: number;
  carType: CarTypeId;
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

export function isValidCarTypeId(carTypeId: any): carTypeId is CarTypeId {
  return Object.values(CarTypeEnum).includes(carTypeId);
}