<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use App\Enums\UserRole;
use App\Models\Store;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;

class TwitterAuthController extends Controller
{
    public function redirectToTwitter()
    {
        return Socialite::driver('twitter')
            ->redirect();
    }

    public function handleTwitterCallback()
    {
        try {
            $twitterUser = Socialite::driver('twitter')->user();

            //check if user exists
            $user = User::where('email', $twitterUser->email)->first();

            if (!$user) {
                //Create username
                $username = explode('@', $twitterUser->email)[0];

                $user = User::create([
                    'username' => $username,
                    'email' => $twitterUser->email,
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(24)),
                    'twitter_id' => $twitterUser->id,
                    'twitter_avatar' => $twitterUser->avatar,
                ]);

                $user->assignRole(UserRole::CREATOR->value);

                Store::create([
                    'name' => $username,
                    'user_id' => $user->id,
                ]);

                event(new Registered($user));
            } else {
                $user->update([
                    'twitter_id' => $twitterUser->id,
                    'twitter_avatar' => $twitterUser->avatar,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            }

            // Login user
            Auth::login($user);

            return redirect()->intended(config('app.frontend_url') . '/dashboard');
        } catch (\Exception $e) {
            dd($e);
        }
    }
}
