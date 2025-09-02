@php
  use App\Helpers\CurrencyHelper;
@endphp

@extends('emails.layouts.base')

@section('content')
    <h1>Hello {{ $order->metadata['customer_details']['firstName'] ?? 'Valued Customer' }},</h1>
    
    <p>Thank you for your purchase! Your order has been confirmed.</p>

    <h2>Order Details:</h2>
    <table>
        <thead>
            <tr>
                <th>Order ID</th>
                <th>Total Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $order->order_id }}</td>
                <td>{{ CurrencyHelper::getCurrencySymbol($order->currency) }} {{ number_format($order->amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <h2>Purchased Items:</h2>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->quantity }}x</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($order->payment_status === 'success')
        <a href="{{ $downloadUrl }}" class="btn">View Downloads</a>

        <p style="margin-top: 24px;"><strong>Important Notes:</strong></p>
        <ul>
            <li>You have lifetime access to your purchased files</li>
            <li>Download links are valid for 7 days</li>
            <li>You can always generate new download links by visiting the downloads page</li>
            <li>For any issues or questions, please contact {{ $sellerStore->name ?? $sellerStore->subdomain }} at {{ $sellerEmail }}</li>
            <li>For any technical issues, please contact us at support@fortiplace.com</li>
        </ul>

        <div class="subcopy" style="margin-bottom: 24px;">
            If you're having trouble with the download button, copy and paste this URL into your browser:
            {{ $downloadUrl }}
        </div>
    @endif

@endsection