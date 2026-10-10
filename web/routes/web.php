<?php
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

// ルートURLにアクセスがあったら、Reactの index.html を返す
Route::get('/{any?}', function () {
    $path = public_path('build/index.html'); // または public/index.html

    if (File::exists($path)) {
        return File::get($path);
    }

    return 'React build not found. Please run npm run build in frontend.';
})->where('any', '.*');
