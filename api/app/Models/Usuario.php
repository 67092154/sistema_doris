<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'email',
        'rol',
        'estado',
        'password',
     
        'foto',
        'password_plain',
    ];

    protected $hidden = [
    
        'remember_token',
    ];
}
