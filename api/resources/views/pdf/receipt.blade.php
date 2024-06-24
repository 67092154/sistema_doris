<!DOCTYPE html>
<html>
<head>
    <title>Recibo de Venta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }
        .receipt {
            width: 100%;
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 5px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <h1>Recibo de Venta</h1>
        <p><strong>Cliente:</strong> {{ $venta->cliente_nombre }} {{ $venta->cliente_apellido }}</p>
        <p><strong>C.I.:</strong> {{ $venta->cliente_ci }}</p>
        <p><strong>Fecha:</strong> {{ $venta->fecha_venta }}</p>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $venta->producto->nombre }}</td>
                    <td>{{ $venta->cantidad }}</td>
                    <td>{{ number_format($venta->producto->precio, 2) }} Bs.</td>
                    <td>{{ number_format($venta->cantidad * $venta->producto->precio, 2) }} Bs.</td>
                </tr>
            </tbody>
        </table>
        <p><strong>Total de la Venta:</strong> {{ number_format($venta->total, 2) }} Bs.</p>
    </div>
</body>
</html>
