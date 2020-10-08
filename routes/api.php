<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::get('positions', [\App\Http\Controllers\PositionController::class, 'getPositions']);

Route::get('employee', [\App\Http\Controllers\EmployeeController::class, 'getEmployees']);
Route::post('employee', [\App\Http\Controllers\EmployeeController::class, 'createEmployee']);
Route::patch('employee', [\App\Http\Controllers\EmployeeController::class, 'updateEmployee']);
Route::delete('employee/{id}', [\App\Http\Controllers\EmployeeController::class, 'deleteEmployee']);

