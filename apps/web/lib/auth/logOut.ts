import { toast } from "sonner";
import axios from "../axios";
import { AxiosError } from "axios";
import Cookies from "js-cookie";


export async function logout(){
    try {
        const response = await axios.post('/logout')

        if(response.status === 204){
            window.location.href = '/login'
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            // If the error is 401 or 400, treat as already logged out
            if (error.response?.status !== 401 && error.response?.status !== 400) {
                toast.error('Failed to log out', {
                    description: error.response?.data.message
                })
            }
        } else {
            toast.error('An unexpected error occurred')
        }
    }finally{
        localStorage.removeItem('token')
        Cookies.remove('token', { path: '/' })
        Cookies.remove('laravel_session', { path: '/' })
        Cookies.remove('XSRF-TOKEN', { path: '/' })
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=')
            if (name.trim().startsWith('g_')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
            }
        })
        if(typeof window !== 'undefined'){
            window.location.href = '/login' 
        }
    }
}