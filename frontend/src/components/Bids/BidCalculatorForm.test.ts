import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BidCalculatorForm from './BidCalculatorForm.vue'
import { CarTypeEnum, type CarType, type CarTypeId, type FormErrors } from '../../types/bids'

describe('BidCalculatorForm.vue', () => {
  const defaultProps = {
    carTypes: [{
      id: 0,
      name: 'Common'
    }, {
      id: 1,
      name: 'Luxury'
    }] as CarType[],
    formData: {
      basePrice: 1000,
      carType: 0 as CarTypeId
    },
    isSubmitting: false,
    errors: {},
    errorMessage: ''
  }

  const createWrapper = (props = {}) => {
    return mount(BidCalculatorForm, {
      props: {
        ...defaultProps,
        ...props
      }
    })
  }

  describe('Component Rendering', () => {
    it('renders the form with all required elements', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.find('h2').text()).toBe('Car Auction Calculator')
      expect(wrapper.find('form').exists()).toBe(true)
      expect(wrapper.find('label[for="basePrice"]').text()).toBe('Base Price *')
      expect(wrapper.find('label[for="carType"]').text()).toBe('Car Type *')
      expect(wrapper.find('input#basePrice').exists()).toBe(true)
      expect(wrapper.find('select#carType').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })

    it('renders car type options correctly', () => {
      const wrapper = createWrapper()
      const options = wrapper.find('select#carType').findAll('option')
      
      expect(options).toHaveLength(2)
      expect(options[0].text()).toBe('Common')
      expect(options[0].attributes('value')).toBe(CarTypeEnum.Common.toString())
      expect(options[1].text()).toBe('Luxury')
      expect(options[1].attributes('value')).toBe(CarTypeEnum.Luxury.toString())
    })
  })

  describe('Props Display', () => {
    it('displays the base price value from props', () => {
      const wrapper = createWrapper({
        formData: { basePrice: 1500, carType: 'Common' }
      })
      
      const input = wrapper.find('input#basePrice')
      expect((input.element as HTMLInputElement).value).toBe('1500')
    })

    it('displays the car type value from props', () => {
      const wrapper = createWrapper({
        formData: { basePrice: 1000, carType: CarTypeEnum.Luxury }
      })
      
      const select = wrapper.find('select#carType')
      expect((select.element as HTMLSelectElement).value).toBe(CarTypeEnum.Luxury.toString())
    })

    it('shows submit button as disabled when isSubmitting is true', () => {
      const wrapper = createWrapper({ isSubmitting: true })
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.text()).toBe('Calculating...')
    })

    it('shows submit button as enabled when isSubmitting is false', () => {
      const wrapper = createWrapper({ isSubmitting: false })
      
      const button = wrapper.find('button[type="submit"]')
      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.text()).toBe('Calculate Cost')
    })

    it('displays error message when provided', () => {
      const errorMessage = 'Something went wrong'
      const wrapper = createWrapper({ errorMessage })
      
      expect(wrapper.find('.submit-message p').text()).toBe(errorMessage)
    })

    it('hides error message when not provided', () => {
      const wrapper = createWrapper({ errorMessage: '' })
      
      expect(wrapper.find('.submit-message').exists()).toBe(false)
    })
  })

  describe('Event Emission Details', () => {
    it('emits update event when base price input changes', async () => {
      const wrapper = createWrapper()
      const input = wrapper.find('input#basePrice')
      
      await input.setValue('2000')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')?.[0]).toEqual(['basePrice', 2000])
    })

    it('emits update event when car type selection changes', async () => {
      const wrapper = createWrapper()
      const select = wrapper.find('select#carType')
      
      await select.setValue(CarTypeEnum.Luxury.toString())
      
      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')?.[0]).toEqual(['carType', CarTypeEnum.Luxury])
    })

    it('emits submit event when form is submitted', async () => {
      const wrapper = createWrapper()
      const form = wrapper.find('form')
      
      await form.trigger('submit.prevent')
      
      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')?.[0]).toEqual([])
    })

    it('does not emit submit when button is disabled', async () => {
      const wrapper = createWrapper({ isSubmitting: true })
      const button = wrapper.find('button[type="submit"]')
      
      await button.trigger('click')
      
      // The button click should not trigger because it's disabled
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('emits multiple update events for sequential changes', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('input#basePrice').setValue('1000')
      await wrapper.find('select#carType').setValue(CarTypeEnum.Luxury.toString())
      await wrapper.find('input#basePrice').setValue('2000')
      
      const updateEvents = wrapper.emitted('update')
      expect(updateEvents).toHaveLength(3)
      expect(updateEvents?.[0]).toEqual(['basePrice', 1000])
      expect(updateEvents?.[1]).toEqual(['carType', CarTypeEnum.Luxury])
      expect(updateEvents?.[2]).toEqual(['basePrice', 2000])
    })

    it('emits correct data types for different fields', async () => {
      const wrapper = createWrapper()
      
      await wrapper.find('input#basePrice').setValue('1500')
      await wrapper.find('select#carType').setValue(CarTypeEnum.Common.toString())
      
      const updateEvents = wrapper.emitted('update')
      expect(updateEvents?.[0]).toEqual(['basePrice', 1500]) // number
      expect(updateEvents?.[1]).toEqual(['carType', CarTypeEnum.Common]) // number
    })
  })

  describe('Field Errors', () => {
    it('handles undefined errors prop', () => {
      const wrapper = createWrapper({ errors: undefined })
      
      expect(wrapper.findAll('.error-message')).toHaveLength(0)
      expect(wrapper.find('input#basePrice').classes()).not.toContain('error')
      expect(wrapper.find('select#carType').classes()).not.toContain('error')
    })

    it('shows base price error when present', () => {
      const errors: Partial<FormErrors> = {
        basePrice: ['Base price is required']
      }
      const wrapper = createWrapper({ errors })
      
      const input = wrapper.find('input#basePrice')
      const errorSpan = wrapper.find('.form-input .error-message')
      
      expect(input.classes()).toContain('error')
      expect(errorSpan.text()).toBe('Base price is required')
    })

    it('shows car type error when present', () => {
      const errors: Partial<FormErrors> = {
        carType: ['Car type is invalid']
      }
      const wrapper = createWrapper({ errors })
      
      const select = wrapper.find('select#carType')
      const errorElements = wrapper.findAll('.form-input .error-message')
      const carTypeError = errorElements.find(el => el.text() === 'Car type is invalid')
      
      expect(select.classes()).toContain('error')
      expect(carTypeError?.text()).toBe('Car type is invalid')
    })

    it('has required attributes on required fields', () => {
      const wrapper = createWrapper()
      
      const basePriceInput = wrapper.find('input#basePrice')
      const carTypeSelect = wrapper.find('select#carType')
      
      expect(basePriceInput.attributes('required')).toBeDefined()
      expect(carTypeSelect.attributes('required')).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero base price input', async () => {
      const wrapper = createWrapper()
      const input = wrapper.find('input#basePrice')
      
      await input.setValue('0')
      
      expect(wrapper.emitted('update')?.[0]).toEqual(['basePrice', 0])
    })

    it('handles negative base price input', async () => {
      const wrapper = createWrapper()
      const input = wrapper.find('input#basePrice')
      
      await input.setValue('-100')
      
      expect(wrapper.emitted('update')?.[0]).toEqual(['basePrice', -100])
    })

    it('handles non-numeric base price input', async () => {
      const wrapper = createWrapper()
      const input = wrapper.find('input#basePrice')
      
      await input.setValue('invalid')
      
      expect(wrapper.emitted('update')?.[0]).toEqual(['basePrice', 0])
    })
  })
})