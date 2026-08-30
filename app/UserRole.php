<?php

namespace App;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case AdminUmrah = 'admin_umrah';
    case Manager = 'manager';
    case DocumentOfficer = 'document_officer';
    case Viewer = 'viewer';

    public function canManagePackages(): bool
    {
        return in_array($this, [self::SuperAdmin, self::AdminUmrah], true);
    }

    public function canManageJamaah(): bool
    {
        return in_array($this, [self::SuperAdmin, self::AdminUmrah], true);
    }

    public function canManageDocuments(): bool
    {
        return in_array($this, [self::SuperAdmin, self::AdminUmrah, self::DocumentOfficer], true);
    }
}
