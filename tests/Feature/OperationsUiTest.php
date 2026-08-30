<?php

use App\Models\User;

test('application shell uses the branded favicon and title', function () {
    $this->get(route('login'))
        ->assertSee('<link rel="icon" href="/logo.png" type="image/png">', false)
        ->assertSee('<title>The Sultan Umroh</title>', false)
        ->assertDontSee('<title>Laravel</title>', false);
});

test('guests cannot access operational pages', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'packages.index',
    'packages.create',
    'jamaah.index',
    'jamaah.create',
    'documents.index',
]);

test('authenticated users can access operational pages', function (string $routeName) {
    $this->actingAs(User::factory()->create())
        ->get(route($routeName))
        ->assertOk();
})->with([
    'packages.index',
    'packages.create',
    'jamaah.index',
    'jamaah.create',
    'documents.index',
]);
