<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jamaahs', function (Blueprint $table) {
            $table->string('signature_path')->nullable()->after('jamaah_notes');
            $table->timestamp('signature_signed_at')->nullable()->after('signature_path');
        });
    }

    public function down(): void
    {
        Schema::table('jamaahs', function (Blueprint $table) {
            $table->dropColumn(['signature_path', 'signature_signed_at']);
        });
    }
};
