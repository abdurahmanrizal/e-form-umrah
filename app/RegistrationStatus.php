<?php

namespace App;

enum RegistrationStatus: string
{
    case Draft = 'draft';
    case Registered = 'registered';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Departed = 'departed';
    case Completed = 'completed';

    public function occupiesSeat(): bool
    {
        return $this !== self::Cancelled;
    }
}
