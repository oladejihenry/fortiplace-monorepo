@component('mail::message')
{{-- Header with Logo --}}
<div style="text-align: center; margin-bottom: 30px;">
    <img src="{{ asset('images/logo.jpg') }}" alt="{{ config('app.name') }}" style="max-width: 200px;">
</div>

{{-- Personalized Greeting --}}
# Hello {{ $user->username }},

{{-- Main Content - Using Laravel's Markdown Support --}}
{!! $content !!}

{{-- Call to Action Button (if needed) --}}
@if(isset($callToAction))
@component('mail::button', ['url' => $callToAction['url']])
{{ $callToAction['text'] }}
@endcomponent
@endif

{{-- Footer with Unsubscribe --}}
<div style="margin-top: 30px; font-size: 12px; color: #718096; text-align: center;">
    <p>
        This email was sent to {{ $user->email }}.<br>
        If you no longer wish to receive these emails, you can 
        <a href="{{ $unsubscribeUrl }}" style="color: #718096; text-decoration: underline;">unsubscribe here</a>.
    </p>
</div>
@endcomponent