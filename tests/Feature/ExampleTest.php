<?php

use App\Models\User;

test('guest is redirected to login from the base url', function () {
    $this->get(route('home'))->assertRedirect(route('login'));
});

test('authenticated user is redirected to dashboard from the base url', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertRedirect(route('dashboard', absolute: false));
});
