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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('email', 100);
            $table->enum('rol', ['Admin', 'Vendedor']);
            $table->enum('estado', ['Activo', 'Inactivo']);
            $table->string('password', 255);
            $table->string('foto', 255)->nullable();
            $table->timestamps();
            $table->string('password_plain')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
