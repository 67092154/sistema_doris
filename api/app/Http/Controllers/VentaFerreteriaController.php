<?php
namespace App\Http\Controllers;

use App\Models\VentaFerreteria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
class VentaFerreteriaController extends Controller
{
    public function index()
    {
        return VentaFerreteria::with('producto')->get();
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

        $venta = VentaFerreteria::create($request->all());

        return response()->json($venta, 201);
    }

    public function show($id)
    {
        return VentaFerreteria::with('producto')->findOrFail($id);
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

        $venta = VentaFerreteria::findOrFail($id);
        $venta->update($request->all());

        return response()->json($venta, 200);
    }

    public function destroy($id)
    {
        VentaFerreteria::destroy($id);

        return response()->json(null, 204);
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

            $venta = VentaFerreteria::create([
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
            $venta = VentaFerreteria::with('producto')->find($ventaId);
            if (!$venta) {
                return response()->json(['error' => 'Venta no encontrada'], 404);
            }

            $pdf = Pdf::loadView('pdf.receipt', compact('venta'))
                      ->setPaper([0, 0, 210, 297], 'portrait') 
                      ->setOptions(['dpi' => 150, 'defaultFont' => 'sans-serif']);

          
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
    // inicio reportes ferreterias
    public function ventasPorFecha(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        return VentaFerreteria::whereBetween('fecha_venta', [$startDate, $endDate])
            ->with('producto')
            ->get();
    }

    public function mejoresClientes()
    {
        return VentaFerreteria::select('cliente_ci', 'cliente_nombre', 'cliente_apellido', DB::raw('SUM(total) as total_gastado'))
            ->groupBy('cliente_ci', 'cliente_nombre', 'cliente_apellido')
            ->orderBy('total_gastado', 'desc')
            ->get();
    }

    public function productosMasVendidos()
    {
        return VentaFerreteria::select('producto_id', DB::raw('SUM(cantidad) as total_vendido'))
            ->groupBy('producto_id')
            ->with('producto')
            ->orderBy('total_vendido', 'desc')
            ->get();
    }

    public function stockCritico()
    {
        $umbral = 10; 
        return Producto::where('stock', '<', $umbral)->get();
    }
    public function getClientByCI($ci)
{
    $venta = VentaFerreteria::where('cliente_ci', $ci)->first();

    if ($venta) {
        return response()->json([
            'nombre' => $venta->cliente_nombre,
            'apellido' => $venta->cliente_apellido,
        ], 200);
    } else {
        return response()->json(null, 404);
    }
}
}
