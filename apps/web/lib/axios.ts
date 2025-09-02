import Axios from "axios"
import Cookies from "js-cookie"
import { getDeviceInfo } from "./utils"

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
})



axios.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Add device information
    const deviceInfo = await getDeviceInfo();
    config.headers['X-Device-Info'] = JSON.stringify(deviceInfo);
    
    // Set proper User-Agent
    // config.headers['User-Agent'] = deviceInfo.userAgent;
    
    // Add additional headers for better device detection
    config.headers['X-Platform'] = deviceInfo.platform;
    config.headers['X-Device-Type'] = deviceInfo.deviceType;
    config.headers['X-Vendor'] = deviceInfo.vendor;
    config.headers['X-Language'] = deviceInfo.language;
  } 
  
  return config;
});

export default axios
