<?php

namespace App\Http\Requests;

use App\Enums\ProductType;
use App\Enums\Currency;
use Illuminate\Foundation\Http\FormRequest;

class CreateProductDraftRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'product_type' => ['required', 'string', 'in:' . implode(',', array_column(ProductType::cases(), 'value'))],
            'price' => ['required', 'numeric', 'min:1000'],
            'metadata' => ['nullable', 'array'],
            'metadata.currency' => ['required', 'string', 'in:' . implode(',', array_column(Currency::cases(), 'value'))],
            // 'metadata.features.*' => ['string'],
            // 'metadata.requirements' => ['nullable', 'array'],
            // 'metadata.requirements.*' => ['string'],
        ];
    }
}
