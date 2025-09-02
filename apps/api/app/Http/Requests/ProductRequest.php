<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ProductType;
use Illuminate\Validation\Rules\File;
use App\Enums\CallToAction;
use Illuminate\Support\Str;

class ProductRequest extends FormRequest
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
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'content' => ['required'],
            'description' => ['nullable', 'string'],
            'product_type' => ['required', 'string', 'in:' . implode(',', array_column(ProductType::cases(), 'value'))],
            'price' => ['required', 'numeric', 'min:1000'],
            'cover_image' => ['nullable', 'string', 'url'],
            'preview_images.*' => ['nullable', 'string', 'url'],
            'file_hash' => ['nullable', 'string', 'max:64'],
            'is_published' => ['boolean'],
            'has_free_trial' => ['boolean'],
            'add_customer_email_to_pdf_footer' => ['boolean'],
            'view_product_online' => ['boolean'],
            'slashed_price' => ['nullable', 'numeric', 'min:1000'],
            'metadata' => ['array'],
            'metadata.currency' => ['required', 'string'],
            'metadata.callToAction' => ['required', 'string', 'in:' . implode(',', CallToAction::values())],
        ];

        if ($this->isMethod('POST')) {
            $rules['product_file'] = [
                'required',
                File::types($this->getAllowedFileTypes())
                    ->max(100 * 1024), // 100MB max
            ];
        }

        return $rules;
    }

    private function getAllowedFileTypes(): array
    {
        $productType = ProductType::from($this->product_type);
        return $productType->allowedFileTypes();
    }
}
