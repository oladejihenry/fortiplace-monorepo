import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '@/lib/axios'

interface CurrencyStore {
  selectedCurrency: string
  isLoading: boolean
  conversionRates: Record<string, number>
  setSelectedCurrency: (currency: string) => void
  setIsLoading: (loading: boolean) => void
  updateConversionRates: (currency: string) => Promise<void>
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: 'NGN',
      isLoading: false,
      conversionRates: {},
      
      setSelectedCurrency: async(currency) => {
        try {
          set({ isLoading: true })
          const url = new URL(window.location.href)
          url.searchParams.set('currency', currency)
          window.history.pushState({}, '', url.toString())

          set({ selectedCurrency: currency })
        } catch (error) {
          console.error('Failed to set currency:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      updateConversionRates: async (currency) => {
        const store = get()
        if (currency === store.selectedCurrency) return

        try {
          set({ isLoading: true })
          const response = await axios.get('/api/currency/rates', {
            params: { target: currency }
          })
          
          if (response.data.success) {
            set({ 
              conversionRates: response.data.rates,
              selectedCurrency: currency 
            })
          }
        } catch (error) {
          console.error('Failed to fetch rates:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'currency-store',
      // Only persist these values
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        conversionRates: state.conversionRates
      })
    }
  )
)