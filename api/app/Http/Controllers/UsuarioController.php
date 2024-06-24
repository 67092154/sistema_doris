<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return Usuario::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'rol' => 'required',
            'estado' => 'required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $input = $request->all();
        $input['password_plain'] = $input['password']; 
        $input['password'] = Hash::make($input['password']); 

        if ($request->hasFile('foto')) {
            $image = $request->file('foto');
            $name = time().'.'.$image->getClientOriginalExtension();
            $destinationPath = public_path('/images');
            $image->move($destinationPath, $name);
            $input['foto'] = '/images/'.$name;
        }

        Usuario::create($input);

        return response()->json(['success' => 'Usuario creado con éxito.']);
    }

    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required',
            'email' => 'required|email',
            'password' => 'nullable',
            'rol' => 'required',
            'estado' => 'required',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $usuario = Usuario::findOrFail($id);
        $input = $request->all();

        if ($request->filled('password')) {
            $input['password_plain'] = $input['password']; 
            $input['password'] = Hash::make($input['password']); 
        } else {
            unset($input['password']);
        }

        if ($request->hasFile('foto')) {
            $image = $request->file('foto');
            $name = time().'.'.$image->getClientOriginalExtension();
            $destinationPath = public_path('/images');
            $image->move($destinationPath, $name);
            $input['foto'] = '/images/'.$name;
        }

        $usuario->update($input);

        return response()->json(['success' => 'Usuario actualizado con éxito.']);
    }

    public function destroy($id)
    {
        Usuario::destroy($id);

        return response()->json(null, 204);
    }

    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $usuario = Usuario::where('email', $request->email)->first();

    if ($usuario && Hash::check($request->password, $usuario->password)) {
        return response()->json(['id' => $usuario->id, 'rol' => $usuario->rol, 'message' => 'Inicio de sesión exitoso.']);
    }

    return response()->json(['message' => 'Credenciales incorrectas.'], 401);
}
}
