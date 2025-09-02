<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ProductType;
use App\Enums\CallToAction;

class UpdateProductDraftRequest extends FormRequest
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
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'product_type' => ['required', 'string', 'in:' . implode(',', array_column(ProductType::cases(), 'value'))],
            'product_file' => ['nullable', 'string', 'url'],
            'file_hash' => ['nullable', 'string', 'max:64'],
            'cover_image' => ['nullable', 'string', 'url'],
            'is_published' => ['boolean'],
            'status' => ['required', 'string', 'in:draft,published'],
            'add_customer_email_to_pdf_footer' => ['boolean'],
            'metadata' => ['array'],
            'metadata.currency' => ['required', 'string'],
            'metadata.callToAction' => ['required', 'string', 'in:' . implode(',', CallToAction::values())],
            'metadata.summary' => ['nullable', 'string'],
        ];
    }
}
