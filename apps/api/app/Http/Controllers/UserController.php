<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use App\Services\FlutterwaveService;
use App\Services\PaystackService;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\Store;
use Illuminate\Support\Facades\Log;

class UserController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }

    public function __construct(
        private FlutterwaveService $flutterwave,
        private PaystackService $paystack
    ) {}

    public function index(): JsonResponse
    {
        $users = User::all();

        return response()->json(UserResource::collection($users));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $user = $request->user();

        Log::info($user);

        FacadesValidator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        $validated = $request->validate([
            'username' => ['required', 'alpha_dash', 'string', 'max:40', 'unique:' . User::class . ',username,' . $user->id, 'without_spaces', function ($attribute, $value, $fail) {
                //check for reserved usernames
                $reservedUsernames = ['admin', 'administrator', 'system', 'mod', 'moderator', 'support', 'api'];
                if (in_array(strtolower($value), $reservedUsernames)) {
                    $fail('This username is reserved.');
                }
            }],
            'email' => ['required', 'email', 'unique:' . User::class . ',email,' . $user->id],
            'store_name' => ['required', 'string', 'max:40', 'unique:' . Store::class . ',name,' . $user->store->id],
            'phone_number' => ['nullable', 'string', 'max:15'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        //Update user
        $user->update([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'description' => $validated['description'],
        ]);

        //Update store if it exists
        $user->store->update([
            'name' => $validated['store_name'],
            'description' => $validated['description'],
            'support_email' => $validated['email'],
            'support_phone' => $validated['phone_number'],
        ]);

        return response()->json(new UserResource($user));
    }

    public function getBankList(): JsonResponse
    {
        $nigerianBankList = $this->flutterwave->getBankList();
        return response()->json($nigerianBankList);
    }

    public function updateBankDetails(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'bank_code' => ['required', 'string', 'max:40'],
            'bank_account_number' => ['required', 'string', 'max:10'],
            'payment_schedule' => ['required', 'string', 'in:daily,weekly,monthly'],
        ]);

        //check if the bank account number is valid
        //use paystack api to validate the bank account number
        $paystackResponse = $this->flutterwave->validateBankAccount(
            $validated['bank_code'],
            $validated['bank_account_number'],
            $validated['payment_schedule']
        );


        if (!$paystackResponse) {
            return response()->json(['message' => 'Invalid bank account number'], 422);
        }

        $user->update([
            'bank_id' => $request->bank_id,
            'bank_code' => $request->bank_code,
            'bank_name' => $request->bank_name,
            'bank_account_number' => $paystackResponse['account_number'],
            'bank_account_name' => $paystackResponse['account_name'],
            'payment_schedule' => $validated['payment_schedule'],
        ]);

        return response()->json(new UserResource($user));
    }
}
