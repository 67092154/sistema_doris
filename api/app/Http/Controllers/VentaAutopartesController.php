<?php

namespace App\Http\Controllers;

use App\Models\VentaAutopartes;
use App\Models\Producto;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class VentaAutopartesController extends Controller
{
    public function index()
    {
        return VentaAutopartes::with('producto')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer',
            'total' => 'required|numeric',
            'cliente_nombre' => 'required|string|max:100',
            'cliente_apellido' => 'required|string|max:100',
            'cliente_ci' => 'required|string|max:20',
            'fecha_venta' => 'required|date',
        ]);

        $venta = VentaAutopartes::create($request->all());

        return response()->json($venta, 201);
    }

    public function show($id)
    {
        return VentaAutopartes::with('producto')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'producto_id' => 'sometimes|required|exists:productos,id',
            'cantidad' => 'sometimes|required|integer',
            'total' => 'sometimes|required|numeric',
            'cliente_nombre' => 'sometimes|required|string|max:100',
            'cliente_apellido' => 'sometimes|required|string|max:100',
            'cliente_ci' => 'sometimes|required|string|max:20',
            'fecha_venta' => 'sometimes|required|date',
        ]);

        $venta = VentaAutopartes::findOrFail($id);
        $venta->update($request->all());

        return response()->json($venta, 200);
    }

    public function destroy($id)
    {
        VentaAutopartes::destroy($id);

        return response()->json(null, 204);
    }

    public function getClientByCI($ci)
    {
        $venta = VentaAutopartes::where('cliente_ci', $ci)->first();

        if ($venta) {
            return response()->json([
                'nombre' => $venta->cliente_nombre,
                'apellido' => $venta->cliente_apellido,
            ], 200);
        } else {
            return response()->json(null, 404);
        }
    }

    public function confirmSale(Request $request)
    {
        $request->validate([
            'ventas' => 'required|array',
            'ventas.*.producto_id' => 'required|exists:productos,id',
            'ventas.*.cantidad' => 'required|integer|min:1',
            'ventas.*.total' => 'required|numeric',
            'ventas.*.cliente_nombre' => 'required|string|max:100',
            'ventas.*.cliente_apellido' => 'required|string|max:100',
            'ventas.*.cliente_ci' => 'required|string|max:20',
        ]);

        $ventas = $request->input('ventas');
        $ventaId = null;

        foreach ($ventas as $ventaData) {
            $producto = Producto::findOrFail($ventaData['producto_id']);
            
            if ($producto->stock < $ventaData['cantidad']) {
                return response()->json(['error' => 'Stock insuficiente para el producto ' . $producto->nombre], 400);
            }

            $venta = VentaAutopartes::create([
                'producto_id' => $ventaData['producto_id'],
                'cantidad' => $ventaData['cantidad'],
                'total' => $ventaData['total'],
                'cliente_nombre' => $ventaData['cliente_nombre'],
                'cliente_apellido' => $ventaData['cliente_apellido'],
                'cliente_ci' => $ventaData['cliente_ci'],
                'fecha_venta' => now(),
            ]);

            $ventaId = $venta->id;

            $producto->stock -= $ventaData['cantidad'];
            $producto->save();
        }

        if ($ventaId) {
            $venta = VentaAutopartes::with('producto')->find($ventaId);
            if (!$venta) {
                return response()->json(['error' => 'Venta no encontrada'], 404);
            }

            $pdf = Pdf::loadView('pdf.receipt', compact('venta'))
                      ->setPaper([0, 0, 210, 297], 'portrait') 
                      ->setOptions(['dpi' => 150, 'defaultFont' => 'sans-serif']);

            // Asegurarse de que el directorio existe
            $pdfDirectory = storage_path('app/public/receipts');
            if (!File::exists($pdfDirectory)) {
                File::makeDirectory($pdfDirectory, 0755, true);
            }

            $pdfPath = $pdfDirectory . '/receipt_' . $venta->id . '.pdf';
            $pdf->save($pdfPath);

            return response()->json(['pdf_url' => url('storage/receipts/receipt_' . $venta->id . '.pdf')]);
        }

        return response()->json(['message' => 'Venta realizada y stock actualizado'], 200);
    }

    // Métodos para reportes
    public function ventasPorFecha(Request $request)
    {
        $startDate = $request->query('start_date', now()->subMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());
    
        return VentaAutopartes::whereBetween('fecha_venta', [$startDate, $endDate])
            ->with('producto')
            ->get();
    }

    public function mejoresClientes()
    {
        return VentaAutopartes::select('cliente_ci', 'cliente_nombre', 'cliente_apellido', DB::raw('SUM(total) as total_gastado'))
            ->groupBy('cliente_ci', 'cliente_nombre', 'cliente_apellido')
            ->orderBy('total_gastado', 'desc')
            ->get();
    }

    public function productosMasVendidos()
    {
        try {
            $productosMasVendidos = VentaAutopartes::select('producto_id', DB::raw('SUM(cantidad) as total_vendido'))
                ->groupBy('producto_id')
                ->with('producto')
                ->orderBy('total_vendido', 'desc')
                ->get();
    
            return response()->json($productosMasVendidos, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function stockCritico()
    {
        $umbral = 10; // Definir umbral para stock crítico
        return Producto::where('stock', '<', $umbral)->get();
    }
}
