<?php

namespace App\Http\Requests;

use App\DocumentStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewJamaahDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('jamaahDocument')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([DocumentStatus::Verified->value, DocumentStatus::Rejected->value])],
            'note' => ['nullable', 'required_if:status,rejected', 'string', 'max:1000'],
        ];
    }
}
