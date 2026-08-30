<?php

namespace App\Http\Requests;

use App\PackageStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUmrahPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->umrahPackage) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', Rule::unique('umrah_packages', 'code')->ignore($this->umrahPackage->id)],
            'departure_date' => ['required', 'date'],
            'return_date' => ['required', 'date', 'after_or_equal:departure_date'],
            'total_seats' => ['required', 'integer', 'min:1'],
            'status' => ['required', Rule::enum(PackageStatus::class)->only([PackageStatus::Draft, PackageStatus::Active])],
            'price' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'registration_open_date' => ['nullable', 'date'],
            'registration_close_date' => ['nullable', 'date', 'after_or_equal:registration_open_date'],
            'meeting_point' => ['nullable', 'string', 'max:255'],
            'airline' => ['nullable', 'string', 'max:255'],
            'hotel_makkah' => ['nullable', 'string', 'max:255'],
            'hotel_madinah' => ['nullable', 'string', 'max:255'],
            'room_type' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'facility_ids' => ['sometimes', 'array'],
            'facility_ids.*' => ['integer', Rule::exists('facilities', 'id')->where('is_active', true)],
        ];
    }
}
