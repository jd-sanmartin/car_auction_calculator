<template>
    <div class="calculation-results">
        <h3>Calculation Results</h3>
        <div v-if="isLoading" class="loading"> <p>Loading...</p></div>

        <div v-else-if="results" class="results-content">
            <div class="cost-breakdown">
                <div class="cost-item">
                    <label>Base Price:</label>
                    <span class="amount">${{ results.basePrice }}</span>
                </div>

                <div class="cost-item">
                    <label>Basic Buyer Fee: <span class="percentage">({{ FeePercentagesByCarType[carType].basicBuyerFeePercentage }}%)*</span></label>
                    <span class="amount">${{ results.basicBuyerFee }}</span>
                </div>

                <div class="cost-item">
                    <label>Special Seller Fee: <span class="percentage">({{ FeePercentagesByCarType[carType].sellerSpecialFeePercentage }}%)</span></label>
                    <span class="amount">${{ results.sellerSpecialFee }}</span>
                </div>

                <div class="cost-item">
                    <label>Association Fee**:</label>
                    <span class="amount">${{ results.associationFee }}</span>
                </div>

                <div class="cost-item">
                    <label>Storage Fee:</label>
                    <span class="amount">${{ results.storageFee }}</span>
                </div>

                <div class="cost-item total">
                    <label>Total Cost:</label>
                    <span class="total-amount">${{ results.totalCost }}</span>
                </div>
            </div>

            <div class="notes">
                <p>* Basic Buyer Fee is calculated over the base price, however, the minimum and maximum values for {{ carType }} vehicles are ${{ FeePercentagesByCarType[carType].basicBuyerFeeMin }} and ${{ FeePercentagesByCarType[carType].basicBuyerFeeMax }}, respectively.</p>
                <p>** Association Fee is based on the price of the vehicle</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BidFormResponse, CarType } from '../../types/bids';
import { FeePercentagesByCarType } from '../../constants/bidConstants';

interface Props {
    carType: CarType;
    results: BidFormResponse | null;
    isLoading: boolean;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
$total-amount-color: #13034c;
$success-color: #28a745;
$title-color: #333;
$notes-text-color: #6c757d;
$text-secondary: #495057;
$text-light: #666;
$background-light: #f8f9fa;
$breakdown-border-color: #e9ecef;
$cost-item-border: #dee2e6;
$currency-font-color: 'Courier New', monospace;

.calculation-results {
    margin-top: 10px 20px;

    h3 {
        margin-bottom: 20px;
        color: $title-color;
    }
}

.loading {
    text-align: center;
    padding: 40px 20px;
    color: $text-light;
    font-style: italic;
}

.results-content {
    background-color: $background-light;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid $breakdown-border-color;
}

.cost-breakdown {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cost-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid $cost-item-border;

    &:last-child {
        border-bottom: none;
    }

    &.total {
        border-bottom: 1px solid $cost-item-border;
        padding-top: 12px;
        margin-top: 8px;
        font-weight: bold;
        font-size: 1.1em;
    }

    label {
        font-weight: 500;
        color: $text-secondary;
    }
}

.amount {
    font-weight: 600;
    color: $success-color;
    font-family: $currency-font-color;
}

.total-amount {
    font-weight: 800;
    color: $total-amount-color;
    font-size: 1.2em;
    font-family: $currency-font-color;
}

.notes {
    margin-top: 20px;
    font-size: 0.9em;
    color: $notes-text-color;
}
</style>