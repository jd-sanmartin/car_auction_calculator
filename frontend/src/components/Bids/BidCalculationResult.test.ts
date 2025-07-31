import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BidCalculationResult from './BidCalculationResult.vue'
import { type BidFormResponse, type CarTypeName } from '../../types/bids'

describe('BidCalculationResult.vue', () => {
  const mockResults: BidFormResponse = {
    basePrice: 1000,
    basicBuyerFee: 50,
    sellerSpecialFee: 20,
    associationFee: 5,
    storageFee: 100,
    totalCost: 1175
  }

  const defaultProps = {
    carTypeName: 'Common' as CarTypeName,
    results: mockResults,
    isLoading: false
  }

  const createWrapper = (props = {}) => {
    return mount(BidCalculationResult, {
      props: {
        ...defaultProps,
        ...props
      }
    })
  }

  describe('Component Rendering', () => {
    it('renders the component with all required elements when results are present', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.find('h3').text()).toBe('Calculation Results')
      expect(wrapper.find('.calculation-results').exists()).toBe(true)
      expect(wrapper.find('.results-content').exists()).toBe(true)
      expect(wrapper.find('.cost-breakdown').exists()).toBe(true)
      expect(wrapper.find('.notes').exists()).toBe(true)
    })

    it('renders all cost items correctly', () => {
      const wrapper = createWrapper()
      const costItems = wrapper.findAll('.cost-item')
      
      expect(costItems).toHaveLength(6) // 5 cost items + 1 total
      
      // Check individual cost items
      expect(costItems[0].find('label').text()).toBe('Base Price:')
      expect(costItems[0].find('.amount').text()).toBe('$1000')
      
      expect(costItems[1].find('label').text()).toContain('Basic Buyer Fee:')
      expect(costItems[1].find('label').text()).toContain('(10%)')
      expect(costItems[1].find('.amount').text()).toBe('$50')
      
      expect(costItems[2].find('label').text()).toContain('Special Seller Fee:')
      expect(costItems[2].find('label').text()).toContain('(2%)')
      expect(costItems[2].find('.amount').text()).toBe('$20')
      
      expect(costItems[3].find('label').text()).toBe('Association Fee**:')
      expect(costItems[3].find('.amount').text()).toBe('$5')
      
      expect(costItems[4].find('label').text()).toBe('Storage Fee:')
      expect(costItems[4].find('.amount').text()).toBe('$100')
      
      expect(costItems[5].find('label').text()).toBe('Total Cost:')
      expect(costItems[5].find('.total-amount').text()).toBe('$1175')
    })

    it('renders notes section correctly for Common car type', () => {
      const wrapper = createWrapper({ carTypeName: 'Common' })
      const notes = wrapper.find('.notes')
      const notesItems = notes.findAll('p')
      
      expect(notesItems).toHaveLength(2)
      expect(notesItems[0].text()).toContain('Basic Buyer Fee is calculated over the base price')
      expect(notesItems[0].text()).toContain('Common vehicles are $10 and $50')
      expect(notesItems[1].text()).toBe('** Association Fee is based on the price of the vehicle')
    })

    it('renders notes section correctly for Luxury car type', () => {
      const wrapper = createWrapper({ carTypeName: 'Luxury' })
      const notes = wrapper.find('.notes')
      const notesItems = notes.findAll('p')
      
      expect(notesItems[0].text()).toContain('Luxury vehicles are $25 and $200')
    })

    it('shows loading state when isLoading is true', () => {
      const wrapper = createWrapper({ isLoading: true })
      
      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('.loading p').text()).toBe('Loading...')
      expect(wrapper.find('.results-content').exists()).toBe(false)
    })

    it('hides loading state when isLoading is false', () => {
      const wrapper = createWrapper({ isLoading: false })
      
      expect(wrapper.find('.loading').exists()).toBe(false)
      expect(wrapper.find('.results-content').exists()).toBe(true)
    })
  })

  describe('Results Display', () => {
    it('shows results when results prop is provided and not loading', () => {
      const wrapper = createWrapper({
        results: mockResults,
        isLoading: false
      })
      
      expect(wrapper.find('.results-content').exists()).toBe(true)
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    it('does not show results when results prop is null', () => {
      const wrapper = createWrapper({
        results: null,
        isLoading: false
      })
      
      expect(wrapper.find('.results-content').exists()).toBe(false)
      expect(wrapper.find('.loading').exists()).toBe(false)
    })

    it('does not show results when loading', () => {
      const wrapper = createWrapper({
        results: mockResults,
        isLoading: true
      })
      
      expect(wrapper.find('.results-content').exists()).toBe(false)
      expect(wrapper.find('.loading').exists()).toBe(true)
    })
  })

  describe('Variations in notes for each car type', () => {
    it('displays correct fee percentages for Common car type', () => {
      const wrapper = createWrapper({ carTypeName: 'Common' })
      
      const basicBuyerFeeLabel = wrapper.findAll('.cost-item')[1].find('label')
      const sellerSpecialFeeLabel = wrapper.findAll('.cost-item')[2].find('label')
      
      expect(basicBuyerFeeLabel.text()).toContain('(10%)')
      expect(sellerSpecialFeeLabel.text()).toContain('(2%)')
    })

    it('displays correct fee percentages for Luxury car type', () => {
      const wrapper = createWrapper({ carTypeName: 'Luxury' })
      
      const basicBuyerFeeLabel = wrapper.findAll('.cost-item')[1].find('label')
      const sellerSpecialFeeLabel = wrapper.findAll('.cost-item')[2].find('label')
      
      expect(basicBuyerFeeLabel.text()).toContain('(10%)')
      expect(sellerSpecialFeeLabel.text()).toContain('(4%)')
    })

    it('displays correct min/max values for Common car type in notes', () => {
      const wrapper = createWrapper({ carTypeNAme: 'Common' })
      const notes = wrapper.find('.notes p')
      
      expect(notes.text()).toContain('$10 and $50')
    })

    it('displays correct min/max values for Luxury car type in notes', () => {
      const wrapper = createWrapper({ carTypeName: 'Luxury' })
      const notes = wrapper.find('.notes p')
      
      expect(notes.text()).toContain('$25 and $200')
    })
  })
})
