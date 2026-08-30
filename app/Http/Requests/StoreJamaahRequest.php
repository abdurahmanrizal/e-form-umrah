<?php

namespace App\Http\Requests;

use App\Gender;
use App\Models\Jamaah;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreJamaahRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->routeIs('public.jamaah.create', 'public.jamaah.store')
            || ($this->user()?->can('create', Jamaah::class) ?? false);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'birth_place' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before:today'],
            'nik' => ['nullable', 'string', 'max:32'],
            'passport_number' => ['nullable', 'string', 'max:50'],
            'passport_issue_date' => ['nullable', 'date'],
            'passport_expiry_date' => ['nullable', 'date', 'after:passport_issue_date'],
            'passport_issuing_office' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'emergency_contact_name' => ['required', 'string', 'max:255'],
            'emergency_contact_relationship' => ['required', 'string', 'max:100'],
            'emergency_contact_phone' => ['required', 'string', 'max:30'],
            'emergency_contact_address' => ['nullable', 'string'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'medical_notes' => ['nullable', 'string'],
            'special_assistance' => ['nullable', 'string'],
            'wheelchair_required' => ['sometimes', 'boolean'],
            'dietary_notes' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
            'jamaah_notes' => ['nullable', 'string'],
            'umrah_package_id' => ['required', 'integer', 'exists:umrah_packages,id'],
        ];
    }

    /** @return array<int, callable> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->filled('nik') && ! $this->filled('passport_number')) {
                    $validator->errors()->add('nik', 'NIK atau nomor passport wajib diisi.');
                }
            },
        ];
    }
}
