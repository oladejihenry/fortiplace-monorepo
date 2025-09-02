<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $couponId = $this->route('coupon')?->id;

        return [
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($couponId)],
            'type' => ['required', 'string', 'in:percentage,fixed'],
            'amount' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    if ($this->type === 'percentage' && ($value < 1 || $value > 100)) {
                        $fail('The percentage must be between 1 and 100.');
                    }
                    if ($this->type === 'fixed' && $value <= 0) {
                        $fail('The fixed amount must be greater than 0.');
                    }
                }
            ],
            'expires_at' => ['required', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The coupon code is required.',
            'code.unique' => 'The coupon code has already been taken.',
            'type.required' => 'The coupon type is required.',
            'type.in' => 'The coupon type must be either percentage or fixed.',
            'amount.required' => 'The coupon amount is required.',
            'amount.numeric' => 'The coupon amount must be a number.',
            'amount.min' => 'The coupon amount must be greater than 0.',
            'expires_at.required' => 'The coupon expiration date is required.',
            'expires_at.date' => 'The coupon expiration date must be a valid date.',
            'expires_at.after' => 'The coupon expiration date must be in the future.',
        ];
    }
}
