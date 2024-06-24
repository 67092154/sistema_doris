<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        return Producto::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria' => 'required|string|max:100',
            'stock' => 'required|integer',
            'tipo' => 'required|in:Material de Ferretería,Autopartes',
            'imagen_url' => 'nullable|string',
            'fecha_actualizacion' => 'required|date',
        ]);

        $producto = Producto::create($request->all());

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return Producto::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
            'descripcion' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric',
            'categoria' => 'sometimes|required|string|max:100',
            'stock' => 'sometimes|required|integer',
            'tipo' => 'sometimes|required|in:Material de Ferretería,Autopartes',
            'imagen_url' => 'nullable|string',
            'fecha_actualizacion' => 'sometimes|required|date',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json($producto, 200);
    }

    public function destroy($id)
    {
        Producto::destroy($id);

        return response()->json(null, 204);
    }
    public function inventario(Request $request)
{
    $tipo = $request->query('tipo');
    if ($tipo) {
        return Producto::where('tipo', $tipo)->get();
    } else {
        return Producto::all();
    }
}
}
