<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\Promotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Services\PromotionService;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;

class PromotionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'role:admin',
            'is_not_banned',
        ];
    }

    public function __construct(private PromotionService $promotionService) {}

    public function index(): JsonResponse
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        //Calculate initial next send at based on schedule config
        $scheduleConfig = $request->schedule_config;
        $nextSendAt = $this->promotionService->calculateInitialSendDate($scheduleConfig);

        $promotion = Promotion::create([
            ...$request->validated(),
            'next_send_at' => $nextSendAt,
            'last_sent_at' => null,
            'send_count' => 0,
        ]);

        if ($request->schedule_now) {
            $this->promotionService->schedulePromotion($promotion);
        }

        return response()->json($promotion, 201);
    }

    public function schedule(Promotion $promotion): JsonResponse
    {
        $this->promotionService->schedulePromotion($promotion);
        return response()->json(['message' => 'Promotion scheduled successfully']);
    }

    public function show(Promotion $promotion): JsonResponse
    {
        return response()->json($promotion);
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion): JsonResponse
    {
        $promotion->update($request->validated());
        return response()->json($promotion);
    }

    public function destroy(Promotion $promotion): JsonResponse
    {
        $promotion->delete();
        return response()->json(['message' => 'Promotion deleted successfully']);
    }
}
