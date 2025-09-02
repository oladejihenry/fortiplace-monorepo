<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Downloads - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'primary': 'rgb(52, 211, 153)',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-900 text-gray-100">
    <!-- Navigation Bar -->
    <nav class="bg-gray-800 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-between h-16">
                <!-- Mobile menu button -->
                <div class="flex items-center sm:hidden">
                    <button type="button" onclick="toggleMobileMenu()" class="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <img class="block h-8 w-auto sm:h-10" 
                         src="{{ config('app.logo', 'https://fortiplace.com/_next/image?url=%2Ffortiplace_transparent.png&w=256&q=75') }}" 
                         alt="{{ config('app.name') }}">
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div class="flex space-x-4">
                        <a href="{{config('app.frontend_url')}}/dashboard" 
                           class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>

            <!-- Mobile Navigation -->
            <div id="mobile-menu" class="hidden sm:hidden">
                <div class="px-2 pt-2 pb-3 space-y-1">
                    <a href="{{config('app.frontend_url')}}/dashboard" 
                       class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                        Dashboard
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <h1 class="text-xl sm:text-2xl font-bold mb-6 text-white">Your Downloads</h1>
            <div class="mb-4">
                <p class="text-gray-300 text-sm sm:text-base">Order ID: {{ $order->order_id }}</p>
                <p class="text-xs sm:text-sm text-gray-400 mt-2">These download links are valid for 7 days. If a link expires, simply return to this page to generate new download links.</p>
            </div>

            <div class="space-y-4">
                @foreach($downloads as $download)
                    <div class="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-700 transition duration-150">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 class="font-semibold text-white">{{ $download['product_name'] }}</h3>
                                <p class="text-sm text-gray-400">{{ ucfirst($download['product_type']) }}</p>
                                <p class="text-xs text-gray-500">File: {{ $download['file_name'] }}</p>
                            </div>
                            <a href="{{ $download['download_url'] }}" 
                               class="bg-primary cursor-pointer hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition duration-150 text-center"
                               target="_blank"
                               download="{{ $download['file_name'] }}">
                                Download
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="mt-6 space-y-2 text-xs sm:text-sm text-gray-400">
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span>You have lifetime access to these files</span>
                </p>
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                    </svg>
                    <span>Download links are refreshed every time you visit this page</span>
                </p>
                <p class="flex items-center">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                    </svg>
                    <span>For any issues, please contact support at support@fortiplace.com</span>
                </p>
            </div>
        </div>
    </div>

    <script>
        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        }
    </script>
</body>
</html>