<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use App\Models\Store;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->user();

            //Check if user exists
            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                //Create username
                $username = explode('@', $googleUser->email)[0];

                //Create user
                $user = User::create([
                    'username' => $username,
                    'email' => $googleUser->email,
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(24)),
                    'google_id' => $googleUser->id,
                    'google_avatar' => $googleUser->avatar,
                ]);

                $user->assignRole(UserRole::CREATOR->value);

                Store::create([
                    'name' => $username,
                    'user_id' => $user->id,
                ]);

                event(new Registered($user));
            } else {
                $user->update([
                    'google_id' => $googleUser->id,
                    'google_avatar' => $googleUser->avatar,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            }


            // Login user
            Auth::login($user);

            return redirect()->intended(config('app.frontend_url') . '/dashboard');



            // return response()->noContent();

            // $frontendUrl = config('app.frontend_url');
            // $successPath = '/google/callback';

            // //authenticate user
            // Log::info('Authenticating user', ['user' => $user]);


            //do not create a token
            // $token = $user->createToken('auth_token')->plainTextToken;


            // $redirectUrl = "{$frontendUrl}{$successPath}?token={$token}";

            // return redirect()->away("{$frontendUrl}{$successPath}");
        } catch (Exception $e) {
            Log::error('Google auth error: ' . $e->getMessage());
            return response()->json(['error' => 'Google auth error'], 500);
        }
    }
}
