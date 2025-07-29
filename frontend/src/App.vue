
<template>
  <div class="app-container">
    <div class="container">
      <BidCalculatorForm 
        :formData="formData"
        :isSubmitting="isSubmitting"
        :errors="errors"
        :errorMessage="errorMessage"
        @update="updateFormData"
        @submit="handleSubmit"
      />
    </div>
    <div class="container">
      <BidCalculationResult :results="calculationResults" :isLoading="isSubmitting" :car-type="formData.carType" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';

import BidCalculationResult from './components/Bids/BidCalculationResult.vue';
import BidCalculatorForm from './components/Bids/BidCalculatorForm.vue';

import { type BidFormData, type FormErrors, type BidFormResponse, isFormError } from './types/bids';
import { bidService } from './services/bidService';

const formData = reactive<BidFormData>({
  basePrice: 1,
  carType: 'Common',
});

const isSubmitting = ref(false);
const errors = ref<Partial<FormErrors>>({});
const errorMessage = ref('');
const calculationResults = ref<BidFormResponse | null>(null);

const updateFormData = (field: keyof BidFormData, value: string | number) => {
  (formData as any)[field] = value;

  // Clear specific field error when user starts typing
  if (errors.value[field]) delete errors.value[field];

  // Reset results when form data changes, so we prevent the user from seeing non-updated results
  calculationResults.value = null;
};

const validateForm = (): boolean => {
  const newErrors: Partial<FormErrors> = {};

  if (!formData.basePrice || isNaN(formData.basePrice) || formData.basePrice < 1) {
    newErrors.basePrice = ['Base price is required and must be at least $1'];
  }

  // TODO: The list of valid car types obtained from the server would be used in this validation, however, for simplicity I will use these hardcoded values
  if (!formData.carType || !['Common', 'Luxury'].includes(formData.carType)) {
    newErrors.carType = ['Car type is required and must be a valid type'];
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  errorMessage.value = '';
  calculationResults.value = null;

  try {
    const response = await bidService.calculate(formData);
    if (!response) {
      errorMessage.value = 'No data received from the server';
      return;
    }

    calculationResults.value = response;
  } catch (error: any) {
    if (isFormError(error)) {
      errors.value = {
        basePrice: error.basePrice,
        carType: error.carType,
      };
      errorMessage.value = 'Invalid form data, please check the errors above';
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again later.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style lang="scss">
// TODO: Move common to external SCSS file
body {
  background-color: #404040;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.app-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  max-width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 40px); // Account for body padding
  align-items: flex-start;
  justify-content: center;
  padding: 15px 20px;
}

.container {
  flex: 1;
  max-width: 600px;
  padding: 10px 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 320px;
}

@media (max-width: 768px) {  
  .app-container {
    flex-direction: column;
    align-items: center;
    padding: 20px;
    min-width: 340px;
  }
  
  .container {
    width: 90%;
    min-width: 340px;
    padding: 20px;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .app-container {
    padding: 15px;
  }
  
  .container {
    padding: 25px;
  }
}

@media (min-width: 1400px) {
  .container {
    max-width: 650px;
  }
}
</style>