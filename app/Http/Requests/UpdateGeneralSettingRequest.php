<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGeneralSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('admin-panel') ?? false;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:1000'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:100'],
            'manager_name' => ['required', 'string', 'max:255'],
            'manager_title' => ['required', 'string', 'max:255'],
            'default_dp' => ['nullable', 'numeric', 'min:0'],
            'manager_signature' => ['nullable', 'string', 'regex:/^data:image\/png;base64,/', 'max:2097152'],
        ];
    }
}
