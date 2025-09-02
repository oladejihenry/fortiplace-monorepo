import {  useMemo } from 'react'
import { useCurrencyStore } from '@/store/use-currency-store'

export function useCurrencyConversion(amount: number, fromCurrency: string) {
  const { selectedCurrency, conversionRates, isLoading } = useCurrencyStore()

  const convertedAmount = useMemo(() => {
    if (fromCurrency === selectedCurrency) return amount
    
    const rate = conversionRates[fromCurrency]
    if (!rate) return amount

    return amount * rate
  }, [amount, fromCurrency, selectedCurrency, conversionRates])

  return { 
    convertedAmount, 
    isLoading,
    currency: selectedCurrency 
  }
}