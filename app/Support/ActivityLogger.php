<?php

namespace App\Support;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLogger
{
    /** @param array<string, mixed> $properties */
    public function log(string $event, Model $subject, ?User $user, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'event' => $event,
            'subject_type' => $subject->getMorphClass(),
            'subject_id' => $subject->getKey(),
            'properties' => $properties,
            'ip_address' => request()->ip(),
        ]);
    }
}
