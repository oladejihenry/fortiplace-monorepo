@php
  use App\Helpers\CurrencyHelper;
@endphp

@extends('emails.layouts.base')

@section('content')
    <h1>Congratulations! New Sale 🎉</h1>
    
    <p>You have received a new order from {{ $order->metadata['customer_details']['firstName'] ?? 'a customer' }}!</p>

    <h2>Order Information:</h2>
    <table>
        <tbody>
            <tr>
                <td>Order ID:</td>
                <td>{{ $order->order_id }}</td>
            </tr>
            <tr>
                <td>Customer:</td>
                <td>{{ $order->metadata['customer_details']['firstName'] ?? '' }} {{ $order->metadata['customer_details']['lastName'] ?? '' }}</td>
            </tr>
            <tr>
                <td>Country:</td>
                <td>{{ $order->metadata['customer_details']['country'] ?? 'Not specified' }}</td>
            </tr>
            <tr>
                <td>Date:</td>
                <td>{{ $order->created_at->format('M d, Y H:i') }}</td>
            </tr>
        </tbody>
    </table>

    <h2>Purchased Items:</h2>
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Your Earnings</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $item)
            <tr>
                <td>{{ $item->product?->name ?? 'Product' }}</td>
                <td>{{ $item->quantity }}x</td>
                <td>{{ CurrencyHelper::getCurrencySymbol($item->currency) }} {{ number_format($item->unit_price, 2) }}</td>
                <td>{{ CurrencyHelper::getCurrencySymbol($item->currency) }} {{ number_format($item->total_price, 2) }}</td>
                <td>₦{{ number_format($item->seller_amount, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Financial Summary:</h2>
    <table>
        <tbody>
            <tr>
                <td>Customer Total:</td>
                <td>{{ CurrencyHelper::getCurrencySymbol($order->currency) }} {{ number_format($order->amount, 2) }}</td>
            </tr>
            <tr>
                <td>Your Total (NGN):</td>
                <td>₦{{ number_format($order->amount_ngn, 2) }}</td>
            </tr>
            <tr>
                <td>Platform Commission (NGN):</td>
                <td>₦{{ number_format($order->commission_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Your Total Earnings (NGN):</td>
                <td>₦{{ number_format($order->seller_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <a href="{{ config('app.frontend_url') . '/customers' }}" class="btn">View Order Details</a>

    <p><strong>Note:</strong> This amount will be available for withdrawal according to your payout schedule.</p>

    
@endsection