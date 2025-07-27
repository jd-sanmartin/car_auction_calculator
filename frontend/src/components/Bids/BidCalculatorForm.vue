<template>
  <div class="car-auction-form">
    <h2>Car Auction Calculator</h2>

    <!-- TODO: handle errors in inputs from the backend -->
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-input">
        <!-- Base price -->
        <label for="basePrice">Base Price *</label>
        <input id="basePrice" :value="formData.basePrice"
          @input="updateField('basePrice', Number(($event.target as HTMLInputElement).value))" type="number" min="1"
          :class="{ error: errors.basePrice }" required />
        <span v-if="errors.basePrice" class="error-message">{{ errors.basePrice[0] }}</span>
      </div>

      <!-- Car Type -->
      <div class="form-input">
        <label for="carType">Car Type *</label>
        <select id="carType" :value="formData.carType"
          @change="updateField('carType', ($event.target as HTMLSelectElement).value)"
          :class="{ error: errors.carType }" required>
          <!-- TODO: Ideally, we would get these values from the backend -->
          <option value="Common">Common</option>
          <option value="Luxury">Luxury</option>
        </select>
        <span v-if="errors.carType" class="error-message">{{ errors.carType[0] }}</span>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'Calculating...' : 'Calculate Cost' }}
        </button>
      </div>

      <div v-if="errorMessage" class="submit-message">
        <p>{{ errorMessage }}</p>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import type { BidFormData, FormErrors } from '../../types/bids';

interface Props {
  formData: BidFormData;
  isSubmitting: boolean;
  errors: FormErrors;
  errorMessage: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update': [field: keyof BidFormData, value: number | string];
  'submit': [];
}>();

const updateField = (field: keyof BidFormData, value: number | string) => { emit('update', field, value); };
const handleSubmit = () => { emit('submit'); };
</script>

<style scoped lang="scss">
$button-color: #007bff;
$error-color: #dc3545;
$title-color: #333;
$label-text-color: #495057;
$border-color: #e9ecef;
$white: white;
$border-radius: 6px;

.car-auction-form {
  max-width: 600px;

  h2 {
    color: $title-color;
    margin-bottom: 24px;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: $label-text-color;
    font-size: 14px;
  }

  input,
  select {
    padding: 12px;
    border: 2px solid $border-color;
    border-radius: $border-radius;
    font-size: 16px;

    &.error {
      border-color: $error-color;
    }
  }
}

.error-message {
  color: $error-color;
  font-size: 12px;
  font-weight: 500;
}

.form-actions {
  margin-top: 8px;
}

.submit-btn {
  background-color: $button-color;
  color: $white;
  border: none;
  padding: 14px 28px;
  border-radius: $border-radius;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: darken($button-color, 10%);
  }
}
</style>