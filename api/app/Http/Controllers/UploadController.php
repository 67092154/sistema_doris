<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $file = $request->file('file');
        $fileName = Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('public/uploads', $fileName);
    
        return response()->json(['url' => Storage::url($path)]);
    }
}
