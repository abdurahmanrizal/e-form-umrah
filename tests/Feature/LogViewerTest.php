<?php

use App\Models\User;
use App\UserRole;

test('log viewer requires authentication', function () {
    $this->get('/log-viewer')->assertRedirect(route('login'));
});

test('log viewer is accessible by user with log.viewer permission', function () {
    $user = User::factory()->create([
        'role' => UserRole::SuperAdmin,
    ]);

    $this->actingAs($user)
        ->get('/log-viewer')
        ->assertOk();
});

test('log viewer is denied for user without log.viewer permission', function () {
    $user = User::factory()->create([
        'role' => UserRole::Viewer,
    ]);

    $this->actingAs($user)
        ->get('/log-viewer')
        ->assertForbidden();
});
