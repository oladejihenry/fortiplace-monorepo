<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\AnalyticsService;
use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Services\UserAgentService;
use Torann\GeoIP\Facades\GeoIP;

class TrackProductViews
{
    public function __construct(private AnalyticsService $analyticsService, private UserAgentService $userAgentService) {}
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);


        $product = $request->route()->parameter('product');

        $ipAddress = $request->header('X-Forwarded-For') ?? $request->ip();




        $agent = new Agent();

        if ($agent->isRobot()) {
            return $response;
        }




        $key = "product_last_last_view:{$product->id}:{$ipAddress}";

        // $geoip = GeoIP::getLocation($ipAddress);

        // Log::info($geoip);



        if (!Cache::has($key)) {
            Cache::put($key, true, now()->addMinutes(30));


            try {
                $this->analyticsService->recordProductView($product, [
                    'ip_address' => $ipAddress,
                    'user_agent' => $request->userAgent(),
                    'device_type' => $agent->deviceType(),
                    'country' =>  null,
                    'city' => null,
                ]);
            } catch (\Exception $e) {
                Log::error('Error recording product view: ' . $e->getMessage());
            }
        }


        return $response;
    }
}
