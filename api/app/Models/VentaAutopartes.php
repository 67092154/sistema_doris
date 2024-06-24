<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VentaAutopartes extends Model
{
    use HasFactory;

    protected $table = 'venta_autopartes';

    protected $fillable = [
        'producto_id',
        'cantidad',
        'total',
        'cliente_nombre',
        'cliente_apellido',
        'cliente_ci',
        'fecha_venta',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
