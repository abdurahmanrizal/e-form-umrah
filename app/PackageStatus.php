<?php

namespace App;

enum PackageStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Inactive = 'inactive';
    case Full = 'full';
    case Departed = 'departed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Archived = 'archived';
}
