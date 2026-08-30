<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('package_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->foreignId('jamaah_id')->constrained()->cascadeOnDelete();
            $table->foreignId('umrah_package_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('seat_count')->default(1);
            $table->string('status')->default('registered');
            $table->timestamp('registered_at');
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->index(['umrah_package_id', 'status']);
            $table->index(['jamaah_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_registrations');
    }
};
