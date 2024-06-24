<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaFerreteriaController;
use App\Http\Controllers\VentaAutopartesController;
use App\Http\Controllers\UploadController;

Route::get('usuarios', [UsuarioController::class, 'index']);
Route::post('usuarios', [UsuarioController::class, 'store']);
Route::get('usuarios/{id}', [UsuarioController::class, 'show']);
Route::put('usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('usuarios/{id}', [UsuarioController::class, 'destroy']);

Route::get('productos', [ProductoController::class, 'index']);
Route::post('productos', [ProductoController::class, 'store']);
Route::get('productos/{id}', [ProductoController::class, 'show']);
Route::put('productos/{id}', [ProductoController::class, 'update']);
Route::patch('productos/{id}', [ProductoController::class, 'update']);
Route::delete('productos/{id}', [ProductoController::class, 'destroy']);
Route::get('productos/inventario', [ProductoController::class, 'inventario']);

Route::get('ventas_ferreteria', [VentaFerreteriaController::class, 'index']);
Route::post('ventas_ferreteria', [VentaFerreteriaController::class, 'store']);
Route::get('ventas_ferreteria/{id}', [VentaFerreteriaController::class, 'show']);
Route::put('ventas_ferreteria/{id}', [VentaFerreteriaController::class, 'update']);
Route::patch('ventas_ferreteria/{id}', [VentaFerreteriaController::class, 'update']);
Route::delete('ventas_ferreteria/{id}', [VentaFerreteriaController::class, 'destroy']);
Route::post('ventas_ferreteria/confirm', [VentaFerreteriaController::class, 'confirmSale']);
Route::get('ferreteria/fecha', [VentaFerreteriaController::class, 'ventasPorFecha']);
Route::get('ferreteria/mejoresclientes', [VentaFerreteriaController::class, 'mejoresClientes']);
Route::get('ferreteria/productosmasvendidos', [VentaFerreteriaController::class, 'productosMasVendidos']);
Route::get('ferreteria/stockcritico', [VentaFerreteriaController::class, 'stockCritico']);
Route::get('ventas_ferreteria/clientes/{ci}', [VentaFerreteriaController::class, 'getClientByCI']);
Route::get('ventas_autopartes', [VentaAutopartesController::class, 'index']);
Route::post('ventas_autopartes', [VentaAutopartesController::class, 'store']);
Route::get('ventas_autopartes/{id}', [VentaAutopartesController::class, 'show']);
Route::put('ventas_autopartes/{id}', [VentaAutopartesController::class, 'update']);
Route::delete('ventas_autopartes/{id}', [VentaAutopartesController::class, 'destroy']);
Route::get('ventas_autopartes/clientes/{ci}', [VentaAutopartesController::class, 'getClientByCI']);
Route::post('ventas_autopartes/confirm', [VentaAutopartesController::class, 'confirmSale']);
Route::get('autopartes/fecha', [VentaAutopartesController::class, 'ventasPorFecha']);
Route::get('autopartes/mejoresclientes', [VentaAutopartesController::class, 'mejoresClientes']);
Route::get('autopartes/productosmasvendidos', [VentaAutopartesController::class, 'productosMasVendidos']);
Route::get('autopartes/stockcritico', [VentaAutopartesController::class, 'stockCritico']);

Route::post('upload', [UploadController::class, 'upload']);

Route::post('login', [UsuarioController::class, 'login']); 

Route::get('/migrate', function () {
    Artisan::call('migrate', ['--force' => true]);
    return 'Migrations completed';
});