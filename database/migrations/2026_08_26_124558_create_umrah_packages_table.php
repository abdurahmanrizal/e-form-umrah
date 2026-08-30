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
        Schema::create('umrah_packages', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('departure_date')->index();
            $table->date('return_date');
            $table->unsignedInteger('total_seats');
            $table->decimal('price', 15, 2)->nullable();
            $table->date('registration_open_date')->nullable();
            $table->date('registration_close_date')->nullable();
            $table->string('meeting_point')->nullable();
            $table->string('airline')->nullable();
            $table->string('hotel_makkah')->nullable();
            $table->string('hotel_madinah')->nullable();
            $table->string('room_type')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('draft')->index();
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('umrah_packages');
    }
};
