<?php

namespace App;

enum DocumentStatus: string
{
    case Missing = 'missing';
    case Uploaded = 'uploaded';
    case UnderReview = 'under_review';
    case Verified = 'verified';
    case Rejected = 'rejected';
    case Expired = 'expired';
}
