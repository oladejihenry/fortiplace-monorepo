<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt #{{ $order->order_id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 15px;
        }
        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .receipt-id {
            font-size: 14px;
            color: #666;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-weight: bold;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .info-columns {
            display: flex;
            justify-content: space-between;
        }
        .info-column {
            width: 48%;
        }
        .customer-info, .seller-info {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table th {
            background-color: #f5f5f5;
            text-align: left;
            padding: 10px;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
         .totals-container {
            width: 100%;
            margin-top: 20px;
            clear: both;
        }
        .totals-table {
            width: 300px;
            margin-left: auto;
            margin-right: 0;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 5px 10px;
            border: none;
            text-align: right;
        }
        .totals-table .total-row td {
            font-weight: bold;
            border-top: 1px solid #eee;
            padding-top: 8px;
        }
        .totals-label {
            width: 60%;
        }
        .totals-value {
            width: 40%;
        }
        .footer {
            clear: both;
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        /* Since PDF doesn't support flexbox well, use a table-based layout instead */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            vertical-align: top;
            width: 50%;
            padding: 0 10px;
            border: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            {{-- <img 
                src="{{ config('app.logo', 'https://fortiplace.com/_next/image?url=%2Ffortiplace_transparent.png&w=256&q=75') }}" 
                alt="Fortiplace Logo" 
                class="logo"
            > --}}
            <div class="receipt-title">Fortiplace Receipt</div>
            <div class="receipt-id">Order #{{ $order->order_id }}</div>
            <div class="receipt-date">{{ $order->created_at->format('F j, Y') }}</div>
        </div>

        <div class="section">
            <div class="section-title">Order Information</div>
            
            <table class="info-table">
                <tr>
                    <td>
                        <div class="customer-info">
                            <h4>Customer Information</h4>
                            <div><strong>Email:</strong> {{ $order->customer_email }}</div>
                            @if(isset($order->metadata['customer_details']))
                                <div><strong>Name:</strong> {{ $order->metadata['customer_details']['firstName'] ?? '' }} {{ $order->metadata['customer_details']['lastName'] ?? '' }}</div>
                            @endif
                            <div><strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}</div>
                            <div><strong>Payment Date:</strong> {{ $order->updated_at->format('F j, Y') }}</div>
                        </div>
                    </td>
                    <td>
                        <div class="seller-info">
                            <h4>Seller Information</h4>
                            <div><strong>Store:</strong> {{ $order->items[0]->product->user->store->name ?? 'Store' }}</div>
                            <div><strong>Email:</strong> {{ $order->items[0]->product->user->email ?? 'Not available' }}</div>
                            @if($order->items[0]->product->user->store->address)
                                <div><strong>Address:</strong> {{ $order->items[0]->product->user->store->address }}</div>
                            @endif
                            <div><strong>Website:</strong> {{ $order->items[0]->product->user->store->subdomain }}.fortiplace.com</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Order Details</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                    // Calculate the actual price from the order amount
                    $actualTotal = $order->amount;
                    $itemCount = $order->items->sum('quantity');
                    $pricePerItem = $itemCount > 0 ? $actualTotal / $itemCount : 0;
                    @endphp
                    
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product->name }}</td>
                        <td>{{ $order->currency }} {{ number_format($pricePerItem, 2) }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ $order->currency }} {{ number_format($pricePerItem * $item->quantity, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="totals-container">
            <table class="totals-table">
                <tr>
                    <td class="totals-label">Subtotal:</td>
                    <td class="totals-value">{{ $order->currency }} {{ number_format($order->amount, 2) }}</td>
                </tr>
                
                @if(isset($order->metadata['fees']) && $order->metadata['fees'] > 0)
                <tr>
                    <td class="totals-label">Fees:</td>
                    <td class="totals-value">{{ $order->currency }} {{ number_format($order->metadata['fees'], 2) }}</td>
                </tr>
                @endif
                
                <tr class="total-row">
                    <td class="totals-label">Total:</td>
                    <td class="totals-value">{{ $order->currency }} {{ number_format($order->amount, 2) }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>If you have any questions, please contact us at support@fortiplace.com</p>
            <p>© {{ date('Y') }} Powered by Fortiplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>