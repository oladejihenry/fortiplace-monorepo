$this->analyticsService->recordProductView($product, [
'ip_address' => $ipAddress,
'user_agent' => $agent->getSummary(
$request->userAgent(),
$request->header('Accept-Language')
),
'device_type' => $agent->getDevice($request->userAgent()),
'country' => $geo->iso_code,
'city' => $geo->city,
]);