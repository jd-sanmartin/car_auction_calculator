import { CarTypeEnum } from "../types/bids";

// I think there can be better approaches to handle this, however, this is a demo which is more focused on backend, so I will keep it this way
export const FeePercentagesByCarType: Record<keyof typeof CarTypeEnum, Record<string, number>> = {
    Common: {
        basicBuyerFeePercentage: 10,
        basicBuyerFeeMin: 10,
        basicBuyerFeeMax: 50,
        sellerSpecialFeePercentage: 2
    },
    Luxury: {
        basicBuyerFeePercentage: 10,
        basicBuyerFeeMin: 25,
        basicBuyerFeeMax: 200,
        sellerSpecialFeePercentage: 4
    }
} as const;
