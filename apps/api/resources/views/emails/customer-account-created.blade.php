@component('mail::message')
# Welcome to Fortiplace

Hi {{ $user->username }},

Your account has been created to help you manage your orders. Here are your login details:

**Email:** {{ $user->email }}  
**Temporary Password:** {{ $password }}

@component('mail::button', ['url' => config('app.frontend_url') . '/login'])
Login to Your Account
@endcomponent

For security reasons, please change your password by logging out and clicking the "Forgot Password?" link on the login page.

You can view your order #{{ $orderId }} and manage your downloads in your account dashboard.

Thanks,<br>
{{ config('app.name') }}
@endcomponent