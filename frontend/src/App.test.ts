import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import App from "./App.vue";
import { bidService } from "./services/bidService";
import type { BidFormResponse, FormErrorsFromServer } from "./types/bids";

// Mock the bidService
vi.mock("./services/bidService", () => ({
  bidService: {
    calculate: vi.fn(),
  },
}));

// Mock child components to focus on App logic
vi.mock("./components/Bids/BidCalculatorForm.vue", () => ({
  default: {
    name: "BidCalculatorForm",
    props: ["formData", "isSubmitting", "errors", "errorMessage"],
    emits: ["update", "submit"],
    template: `
      <div data-testid="bid-calculator-form">
        <div data-testid="form-data">{{ JSON.stringify(formData) }}</div>
        <div data-testid="is-submitting">{{ isSubmitting }}</div>
        <div data-testid="errors">{{ JSON.stringify(errors) }}</div>
        <div data-testid="error-message">{{ errorMessage }}</div>
        <button @click="$emit('submit')" data-testid="submit-btn">Submit</button>
        <button @click="$emit('update', 'basePrice', 1000)" data-testid="update-base-price-btn">Update Price</button>
        <button @click="$emit('update', 'carType', 'Luxury')" data-testid="update-type-btn">Update Type</button>
      </div>
    `,
  },
}));

vi.mock("./components/Bids/BidCalculationResult.vue", () => ({
  default: {
    name: "BidCalculationResult",
    props: ["results", "isLoading", "carType"],
    template: `
      <div data-testid="bid-calculation-result">
        <div data-testid="results">{{ JSON.stringify(results) }}</div>
        <div data-testid="loading">{{ isLoading }}</div>
        <div data-testid="car-type">{{ carType }}</div>
      </div>
    `,
  },
}));

describe("App.vue", () => {
  const mockBidService = vi.mocked(bidService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both components", () => {
    const wrapper = mount(App);

    expect(wrapper.find('[data-testid="bid-calculator-form"]').exists()).toBe(
      true
    );
    expect(
      wrapper.find('[data-testid="bid-calculation-result"]').exists()
    ).toBe(true);
  });

  it("initializes with default form data", () => {
    const wrapper = mount(App);

    const formDataElement = wrapper.find('[data-testid="form-data"]');
    const formData = JSON.parse(formDataElement.text());

    expect(formData).toEqual({
      basePrice: 1,
      carType: "Common",
    });
  });

  it("initializes with correct default states", () => {
    const wrapper = mount(App);

    expect(wrapper.find('[data-testid="is-submitting"]').text()).toBe("false");
    expect(wrapper.find('[data-testid="errors"]').text()).toBe("{}");
    expect(wrapper.find('[data-testid="error-message"]').text()).toBe("");
    expect(wrapper.find('[data-testid="results"]').text()).toBe("null");
  });

  describe("Form", () => {
    it("displays calculation results on successful submission", async () => {
      const mockResponse: BidFormResponse = {
        basePrice: 1000,
        basicBuyerFee: 100,
        sellerSpecialFee: 50,
        associationFee: 25,
        storageFee: 25,
        totalCost: 1200,
      };

      mockBidService.calculate.mockResolvedValue(mockResponse);

      const wrapper = mount(App);

      await wrapper.find('[data-testid="submit-btn"]').trigger("click");
      await nextTick();

      const results = JSON.parse(
        wrapper.find('[data-testid="results"]').text()
      );
      expect(results).toEqual(mockResponse);
    });

    describe("Form Updates", () => {
      it("updates basePrice in formData object when update event is emitted from the base price input", async () => {
        const wrapper = mount(App);

        await wrapper
          .find('[data-testid="update-base-price-btn"]')
          .trigger("click");
        await nextTick();

        const formData = JSON.parse(
          wrapper.find('[data-testid="form-data"]').text()
        );
        expect(formData.basePrice).toBe(1000);
      });

      it("updates car type in formData object when update event is emitted from the car type input", async () => {
        const wrapper = mount(App);

        await wrapper.find('[data-testid="update-type-btn"]').trigger("click");
        await nextTick();

        const formData = JSON.parse(
          wrapper.find('[data-testid="form-data"]').text()
        );
        expect(formData.carType).toBe("Luxury");
      });

      it("clears specific field errors when updating form data", async () => {
        const wrapper = mount(App);

        // Set some initial errors
        const vm = wrapper.vm as any;
        vm.errors = { basePrice: ["Some error"], carType: ["Another error"] };
        await nextTick();

        // Update basePrice - should clear basePrice error but keep carType error
        await wrapper
          .find('[data-testid="update-base-price-btn"]')
          .trigger("click");
        await nextTick();

        const errors = JSON.parse(
          wrapper.find('[data-testid="errors"]').text()
        );
        expect(errors.basePrice).toBeUndefined();
        expect(errors.carType).toEqual(["Another error"]);
      });

      it("resets calculation results when form data changes", async () => {
        const wrapper = mount(App);
        const vm = wrapper.vm as any;

        // Set some initial results
        vm.calculationResults = {
          basePrice: 1000,
          totalCost: 1200,
          basicBuyerFee: 100,
          sellerSpecialFee: 50,
          associationFee: 25,
          storageFee: 25,
        };
        await nextTick();

        // Update form data
        await wrapper
          .find('[data-testid="update-base-price-btn"]')
          .trigger("click");
        await nextTick();

        expect(wrapper.find('[data-testid="results"]').text()).toBe("null");
      });
    });

    describe("Form Validation", () => {
      it("prevents submission with invalid base price (0)", async () => {
        const wrapper = mount(App);
        const vm = wrapper.vm as any;

        // Set invalid base price
        vm.formData.basePrice = 0;
        await nextTick();

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        expect(mockBidService.calculate).not.toHaveBeenCalled();
        const errors = JSON.parse(
          wrapper.find('[data-testid="errors"]').text()
        );
        expect(errors.basePrice).toEqual([
          "Base price is required and must be at least $1",
        ]);
      });

      it("prevents submission with invalid base price (negative)", async () => {
        const wrapper = mount(App);
        const vm = wrapper.vm as any;

        vm.formData.basePrice = -100;
        await nextTick();

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        expect(mockBidService.calculate).not.toHaveBeenCalled();
        const errors = JSON.parse(
          wrapper.find('[data-testid="errors"]').text()
        );
        expect(errors.basePrice).toEqual([
          "Base price is required and must be at least $1",
        ]);
      });

      it("prevents submission with invalid car type", async () => {
        const wrapper = mount(App);
        const vm = wrapper.vm as any;

        vm.formData.carType = "InvalidType";
        await nextTick();

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        expect(mockBidService.calculate).not.toHaveBeenCalled();
        const errors = JSON.parse(
          wrapper.find('[data-testid="errors"]').text()
        );
        expect(errors.carType).toEqual([
          "Car type is required and must be a valid type",
        ]);
      });

      it("allows submission with valid form data", async () => {
        const mockResponse: BidFormResponse = {
          basePrice: 1000,
          basicBuyerFee: 100,
          sellerSpecialFee: 50,
          associationFee: 25,
          storageFee: 25,
          totalCost: 1200,
        };

        mockBidService.calculate.mockResolvedValue(mockResponse);

        const wrapper = mount(App);
        const vm = wrapper.vm as any;

        vm.formData.basePrice = 1000;
        vm.formData.carType = "Luxury";
        await nextTick();

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        expect(mockBidService.calculate).toHaveBeenCalledWith({
          basePrice: 1000,
          carType: "Luxury",
        });
      });
    });

    describe("Error Handling", () => {
      it("handles server validation errors", async () => {
        const serverErrors: FormErrorsFromServer = {
          basePrice: ["Server validation error for base price"],
          carType: ["Server validation error for car type"],
        };

        mockBidService.calculate.mockRejectedValue(serverErrors);

        const wrapper = mount(App);

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        const errors = JSON.parse(
          wrapper.find('[data-testid="errors"]').text()
        );
        expect(errors).toEqual({
          basePrice: ["Server validation error for base price"],
          carType: ["Server validation error for car type"],
        });

        expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
          "Invalid form data, please check the errors above"
        );
      });

      it("handles unexpected errors", async () => {
        const unexpectedError = new Error("Network error");
        mockBidService.calculate.mockRejectedValue(unexpectedError);

        const wrapper = mount(App);

        await wrapper.find('[data-testid="submit-btn"]').trigger("click");
        await nextTick();

        expect(wrapper.find('[data-testid="error-message"]').text()).toBe(
          "An unexpected error occurred. Please try again later."
        );
      });
    });
  });
});

describe("Props Passing", () => {
  it("passes correct props to BidCalculatorForm component", () => {
    const wrapper = mount(App);
    const formData = JSON.parse(
      wrapper.find('[data-testid="form-data"]').text()
    );

    expect(
      wrapper.findComponent({ name: "BidCalculatorForm" }).props()
    ).toEqual({
      formData: formData,
      isSubmitting: false,
      errors: {},
      errorMessage: "",
    });
  });

  it("passes correct props to BidCalculationResult component", async () => {
    const wrapper = mount(App);
    const vm = wrapper.vm as any;

    const mockResults: BidFormResponse = {
      basePrice: 1000,
      basicBuyerFee: 100,
      sellerSpecialFee: 50,
      associationFee: 25,
      storageFee: 25,
      totalCost: 1200,
    };

    vm.calculationResults = mockResults;
    vm.formData.carType = "Luxury";
    vm.isSubmitting = true;
    await nextTick();

    expect(wrapper.find('[data-testid="results"]').text()).toBe(
      JSON.stringify(mockResults)
    );
    expect(wrapper.find('[data-testid="loading"]').text()).toBe("true");
    expect(wrapper.find('[data-testid="car-type"]').text()).toBe("Luxury");
  });
});
