import axios from '../axios'

export const createCoupon = async (data: any) => {
  await getSanctumToken()
  const response = await axios.post('/api/coupons', data)
  if (response.status !== 201) {
    throw new Error(response.data.message)
  }
  return response.data
}

export const getCoupons = async () => {
  await getSanctumToken()
  const response = await axios.get('/api/coupons')
  return response.data
}

export const applyCoupon = async (
  couponCode: string,
  totalAmount: number,
  currency: string,
  productIds: string[],
) => {
  await getSanctumToken()
  const response = await axios.post('/api/coupons/apply', {
    couponCode,
    total_amount: totalAmount,
    currency,
    productIds,
  })
  return response.data
}

export const updateCoupon = async (id: string, data: any) => {
  await getSanctumToken()
  const response = await axios.put(`/api/coupons/${id}`, data)
  return response.data
}

export const deleteCoupon = async (id: string) => {
  await getSanctumToken()
  const response = await axios.delete(`/api/coupons/${id}`)
  return response.data
}

//sanctum token
export const getSanctumToken = async () => {
  const response = await axios.get('/sanctum/csrf-cookie')
  return response.data
}
