<?php

use Illuminate\Support\Facades\Route;
use App\Jobs\SendTestEmail;

// Route::inertia('/', 'welcome')->name('home');

Route::get('/', function () {
    $user=App\Models\User::first();
    return response()->json([
        'status' => 'success',
        'message' => 'API is running smoothly',
        'user' => $user
    ], 200);
});

Route::get('/send-email', function () {

    

    SendTestEmail::dispatch(
        'mohammadmasud34@gmail.com',
        'hello, this is a test email sent from Laravel queued job.'
    );

    return response()->json([
        'message' => 'Email has been added to the queue.',
    ]);
});