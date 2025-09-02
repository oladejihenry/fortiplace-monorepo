<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Store;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use App\Jobs\AddUserToSenderNet;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        FacadesValidator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        $request->validate([
            'username' => [
                'required',
                'alpha_dash',
                'string',
                'max:40',
                'unique:' . User::class,
                'without_spaces',
                function ($attribute, $value, $fail) {
                    //check for reserved usernames
                    if ($this->isReservedUsername($value)) {
                        $fail('This username is reserved.');
                    }
                }
            ],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', Rules\Password::defaults()],
        ], [
            'username.without_spaces' => 'The username cannot contain spaces.',
        ]);

        $user = User::create([
            'username' => strtolower($request->username),
            'email' => strtolower($request->email),
            'password' => Hash::make($request->string('password')),
        ]);

        $user->assignRole(UserRole::CREATOR->value);

        Store::create([
            'name' => strtolower($request->username),
            'user_id' => $user->id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        AddUserToSenderNet::dispatch($user->email, config('services.sender_net.group_id'), $user->username);

        return response()->noContent();
    }

    protected function isReservedUsername($username)
    {

        return in_array(strtolower($username), config('username.reserved', []));
    }
}
