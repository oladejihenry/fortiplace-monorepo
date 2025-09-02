<x-mail::message>
# Hello {{ $order->metadata['customer_details']['firstName'] ?? 'there' }},

We noticed you haven't completed your purchase of {{ $items->count() }} {{ Str::plural('item', $items->count()) }} in your cart:

**Your Selected Items:**
@foreach($items as $item)
- {{ $item->product->name }} ({{ $item->quantity }}x)
  - Price: {{ $order->currency }} {{ number_format($item->unit_price, 2) }}
  @if($item->product->is_limited_time ?? false)
  - **Limited Time Offer!**
  @endif
@endforeach

**Total Amount:** {{ $order->currency }} {{ number_format($order->amount, 2) }}

<x-mail::button :url="$checkoutUrl">
Complete Your Purchase
</x-mail::button>

Don't miss out on these great products! If you have any questions or need assistance, our support team is here to help.

Thanks,<br>
{{ config('app.name') }}

</x-mail::message>