<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{{ $title ?? 'Email Notification' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f9f9fb;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 32px 24px;
            border-radius: 12px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }
        .header-links {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 24px;
        }
        .header-links a {
            color: #34d399;
            font-weight: bold;
            font-size: 16px;
            text-decoration: none;
        }
        h1 {
            font-size: 20px;
            margin: 0 0 10px;
        }
        h2 {
            font-size: 18px;
            margin-top: 24px;
            margin-bottom: 10px;
        }
        p, ul {
            font-size: 15px;
            line-height: 1.6;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }
        th {
            background: #f1f5f9;
            padding: 12px 10px;
            font-weight: 600;
            text-align: left;
            font-size: 15px;
        }
        td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 15px;
        }
        .btn {
            display: inline-block;
            background-color: #34d399;
            color: #fff !important;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-decoration: none;
            margin-top: 24px;
        }
        .reasons {
            background-color: #34d399;
            padding: 20px;
            border-radius: 10px;
            margin-top: 32px;
            color: #fff;
        }
        .reasons-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .reason-item {
            font-size: 15px;
            margin-bottom: 4px;
        }
        .subcopy {
            font-size: 13px;
            color: #555;
            margin-top: 24px;
        }
        @media only screen and (max-width: 480px) {
            .container {
                padding: 20px 15px;
            }
            th, td {
                font-size: 14px;
            }
            .header-links {
                flex-direction: column;
                gap: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- @include('emails.partials.header') --}}
        @yield('content')
        @include('emails.partials.footer')
    </div>
</body>
</html>
