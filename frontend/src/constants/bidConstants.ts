import type { CarType } from "../types/bids";

export const FeePercentagesByCarType: Record<CarType, Record<string, number>> = {
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
