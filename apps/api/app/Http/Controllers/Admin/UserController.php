<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use App\Notifications\UserBanned;
use App\Notifications\UserUnbanned;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'role:admin',
            'is_not_banned',
        ];
    }


    /**
     * Display a listing of the users.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        //Filter by role
        if ($request->has('role')) {
            $query->role($request->input('role'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        //sort users
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $allowedSortFields = ['username', 'email', 'created_at', 'updated_at'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        //Paginate users
        $perPage = $request->input('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $perPage,
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Update the specified user's role.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(Role::pluck('name')->toArray())],
        ]);

        //Get the user's current roles
        $currentRoles = $user->roles->pluck('name')->toArray();

        //Update the user's roles
        $user->syncRoles($validated['role']);


        return response()->json([
            'message' => 'User roles updated successfully',
            'user' => new UserResource($user->fresh('roles')),
            'role' => $user->roles->pluck('name'),
        ]);
    }


    /**
     * Ban the specified user.
     */
    public function ban(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        //prevent banning yourself
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot ban yourself'
            ], 403);
        }

        //check if already banned
        if ($user->isBanned()) {
            return response()->json([
                'message' => 'User is already banned',
                'user' => new UserResource($user),
            ], 400);
        }

        //ban the user
        $user->ban($validated['reason'], $request->user());

        //revoke all tokens for the user
        $user->tokens()->delete();

        //if user has a store, deactivate it
        if ($user->store) {
            $user->store->update(['is_active' => false]);
        }

        //send notification to the user
        $user->notify(new UserBanned($validated['reason']));

        return response()->json([
            'message' => "User '{$user->username}' has been banned successfully.",
            'user' => new UserResource($user->fresh(['roles', 'store'])),
        ]);
    }

    /**
     * Unban the specified user.
     */
    public function unban(Request $request, User $user): JsonResponse
    {
        //check if actually banned
        if (!$user->isBanned()) {
            return response()->json([
                'message' => 'User is not banned',
                'user' => new UserResource($user),
            ], 400);
        }

        //unban the user
        $user->unban();

        //if user has a store, activate it
        if ($user->store) {
            $user->store->update(['is_active' => true]);
        }

        //send notification to the user
        $user->notify(new UserUnbanned());

        return response()->json([
            'message' => "User '{$user->username}' has been unbanned successfully.",
            'user' => new UserResource($user->fresh(['roles', 'store'])),
        ]);
    }

    /**
     * Disable the specified user's payout.
     */
    public function disablePayout(Request $request, User $user): JsonResponse
    {
        $user->update(['disable_payouts' => true]);

        return response()->json([
            'message' => "User '{$user->username}' payout has been disabled successfully.",
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Enable the specified user's payout.
     */
    public function enablePayout(Request $request, User $user): JsonResponse
    {
        $user->update(['disable_payouts' => false]);

        return response()->json([
            'message' => "User '{$user->username}' payout has been enabled successfully.",
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        $authUser = $request->user();

        //prevent deleting yourself
        if ($user->id === $authUser->id && $authUser->hasRole('admin')) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        $username = $user->username;

        $user->delete();

        return response()->json(['message' => "User {$username} deleted successfully"]);
    }
}
