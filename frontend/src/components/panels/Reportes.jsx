import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';
import logo from './logotropical.png';

const endpoint = 'http://localhost:8000/api'; 

const Reportes = () => {
    const [ventasAutopartes, setVentasAutopartes] = useState([]);
    const [productosAutopartes, setProductosAutopartes] = useState([]);
    const [clientesAutopartes, setClientesAutopartes] = useState([]);
    const [inventarioAutopartes, setInventarioAutopartes] = useState([]);
    const [ventasFerreteria, setVentasFerreteria] = useState([]);
    const [productosFerreteria, setProductosFerreteria] = useState([]);
    const [clientesFerreteria, setClientesFerreteria] = useState([]);
    const [inventarioFerreteria, setInventarioFerreteria] = useState([]);
    const [filtroPeriodo, setFiltroPeriodo] = useState('Mensual');
    const [tipoInventario, setTipoInventario] = useState('');
    const [fileName, setFileName] = useState('reportes.pdf');
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const toast = useRef(null);

    const fetchData = async (periodo = 'Mensual') => {
        try {
            const [
                ventasAutopartesResponse,
                productosAutopartesResponse,
                clientesAutopartesResponse,
                inventarioAutopartesResponse,
                ventasFerreteriaResponse,
                productosFerreteriaResponse,
                clientesFerreteriaResponse,
                inventarioFerreteriaResponse
            ] = await Promise.all([
                axios.get(`${endpoint}/autopartes/fecha`, { params: { start_date: getStartDate(periodo), end_date: getEndDate() } }),
                axios.get(`${endpoint}/autopartes/productosmasvendidos`),
                axios.get(`${endpoint}/autopartes/mejoresclientes`),
                axios.get(`${endpoint}/autopartes/stockcritico`),
                axios.get(`${endpoint}/ferreteria/fecha`, { params: { start_date: getStartDate(periodo), end_date: getEndDate() } }),
                axios.get(`${endpoint}/ferreteria/productosmasvendidos`),
                axios.get(`${endpoint}/ferreteria/mejoresclientes`),
                axios.get(`${endpoint}/ferreteria/stockcritico`)
            ]);

            setVentasAutopartes(ventasAutopartesResponse.data);
            setProductosAutopartes(productosAutopartesResponse.data);
            setClientesAutopartes(clientesAutopartesResponse.data);
            setInventarioAutopartes(inventarioAutopartesResponse.data);
            setVentasFerreteria(ventasFerreteriaResponse.data);
            setProductosFerreteria(productosFerreteriaResponse.data);
            setClientesFerreteria(clientesFerreteriaResponse.data);
            setInventarioFerreteria(inventarioFerreteriaResponse.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStartDate = (periodo) => {
        const date = new Date();
        if (periodo === 'Diario') {
            return date.toISOString().split('T')[0];
        } else if (periodo === 'Semanal') {
            date.setDate(date.getDate() - 7);
        } else if (periodo === 'Mensual') {
            date.setMonth(date.getMonth() - 1);
        }
        return date.toISOString().split('T')[0];
    };

    const getEndDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const ventasTotales = (ventas) => ventas.reduce((acc, venta) => acc + parseFloat(venta.total), 0).toFixed(2);
    const ventasPorFecha = (ventas) => ventas.map(venta => parseFloat(venta.total));

    const dataVentas = (ventas) => ({
        labels: ventas.map(venta => new Date(venta.fecha_venta).toLocaleDateString()),
        datasets: [
            {
                label: 'Ventas',
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                data: ventasPorFecha(ventas)
            }
        ]
    });

    const dataProductos = (productos) => ({
        labels: productos.map(producto => producto.producto.nombre),
        datasets: [
            {
                label: 'Ventas',
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                data: productos.map(producto => parseFloat(producto.total_vendido))
            }
        ]
    });

    const dataClientes = (clientes) => ({
        labels: clientes.map(cliente => cliente.cliente_nombre),
        datasets: [
            {
                label: 'Total Gastado',
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
                data: clientes.map(cliente => parseFloat(cliente.total_gastado))
            }
        ]
    });

    const opcionesPeriodo = [
        { label: 'Diario', value: 'Diario' },
        { label: 'Semanal', value: 'Semanal' },
        { label: 'Mensual', value: 'Mensual' }
    ];

    const opcionesTipoInventario = [
        { label: 'Todos', value: '' },
        { label: 'Material de Ferretería', value: 'Material de Ferretería' },
        { label: 'Autopartes', value: 'Autopartes' }
    ];

    const exportPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        doc.text('Ferreteria y Autopartes Tropical', 20, 10);
        doc.addImage(logo, 'PNG', 150, 5, 50, 20);
        doc.text(`Fecha del reporte: ${date}`, 20, 30);
        doc.text(`Tipo de inventario: ${tipoInventario || 'Todos'}`, 20, 40);
        
       
        doc.autoTable({
            startY: 50, 
            head: [['Producto', 'Categoría', 'Stock']],
            body: filteredInventario(inventarioAutopartes).map(item => [item.nombre, item.categoria, item.stock.toString()])
        });
        
        doc.save(fileName);
        setIsDialogVisible(false);
    };
    const filteredInventario = (inventario) => inventario.filter(item => !tipoInventario || item.tipo === tipoInventario);

    const renderChart = (data, title) => (
        <div className="chart-container">
            <Panel header={title} className="report-panel">
                <Chart type="pie" data={data} style={{ position: 'relative', width: '100%', height: '100%' }} />
            </Panel>
        </div>
    );

    const stockCritico = (inventario) => inventario.filter(item => item.stock < 10);

    return (
        <div className="reportes-container">
            <Toast ref={toast} />

            <TabView>
                <TabPanel header="Autopartes">
                    <Panel header="Resumen de Ventas" className="report-panel">
                        <div className="chart-row">
                            {renderChart(dataVentas(ventasAutopartes), 'Ventas')}
                            {renderChart(dataProductos(productosAutopartes), 'Productos')}
                            {renderChart(dataClientes(clientesAutopartes), 'Clientes')}
                        </div>
                        <div className="p-col-12">
                            <h3>Total de Ventas: {ventasTotales(ventasAutopartes)} Bs.</h3>
                            <Dropdown value={filtroPeriodo} options={opcionesPeriodo} onChange={(e) => { setFiltroPeriodo(e.value); fetchData(e.value); }} placeholder="Selecciona un periodo" />
                        </div>
                    </Panel>

                    <Panel header="Niveles de Inventario" className="report-panel">
                        <div className="p-grid p-nogutter">
                            <div className="p-col-12 p-md-6">
                                <Dropdown value={tipoInventario} options={opcionesTipoInventario} onChange={(e) => setTipoInventario(e.value)} placeholder="Filtrar por tipo" />
                            </div>
                            <div className="p-col-12 p-md-6" style={{ textAlign: 'right' }}>
                                <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={() => setIsDialogVisible(true)} />
                            </div>
                        </div>
                        <DataTable value={filteredInventario(inventarioAutopartes)} paginator rows={5} id="inventario-table">
                            <Column field="nombre" header="Producto" sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" sortable />
                        </DataTable>
                    </Panel>

                    <Panel header="Stock Crítico" className="report-panel">
                        <DataTable value={stockCritico(inventarioAutopartes)} paginator rows={5} id="stock-critico-table">
                            <Column field="nombre" header="Producto" sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" sortable />
                        </DataTable>
                    </Panel>
                </TabPanel>

                <TabPanel header="Ferretería">
                    <Panel header="Resumen de Ventas" className="report-panel">
                        <div className="chart-row">
                            {renderChart(dataVentas(ventasFerreteria), 'Ventas')}
                            {renderChart(dataProductos(productosFerreteria), 'Productos')}
                            {renderChart(dataClientes(clientesFerreteria), 'Clientes')}
                        </div>
                        <div className="p-col-12">
                            <h3>Total de Ventas: {ventasTotales(ventasFerreteria)} Bs.</h3>
                            <Dropdown value={filtroPeriodo} options={opcionesPeriodo} onChange={(e) => { setFiltroPeriodo(e.value); fetchData(e.value); }} placeholder="Selecciona un periodo" />
                        </div>
                    </Panel>

                    <Panel header="Niveles de Inventario" className="report-panel">
                        <div className="p-grid p-nogutter">
                            <div className="p-col-12 p-md-6">
                                <Dropdown value={tipoInventario} options={opcionesTipoInventario} onChange={(e) => setTipoInventario(e.value)} placeholder="Filtrar por tipo" />
                            </div>
                            <div className="p-col-12 p-md-6" style={{ textAlign: 'right' }}>
                                <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={() => setIsDialogVisible(true)} />
                            </div>
                        </div>
                        <DataTable value={filteredInventario(inventarioFerreteria)} paginator rows={5} id="inventario-table">
                            <Column field="nombre" header="Producto" sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" sortable />
                        </DataTable>
                    </Panel>

                    <Panel header="Stock Crítico" className="report-panel">
                        <DataTable value={stockCritico(inventarioFerreteria)} paginator rows={5} id="stock-critico-table">
                            <Column field="nombre" header="Producto" sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" sortable />
                        </DataTable>
                    </Panel>
                </TabPanel>
            </TabView>

            <Dialog header="Nombre del Reporte" visible={isDialogVisible} style={{ width: '50vw' }} onHide={() => setIsDialogVisible(false)}>
                <div className="p-field">
                    <label htmlFor="fileName">Nombre del Archivo</label>
                    <InputText id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                </div>
                <Button label="Exportar" icon="pi pi-check" className="p-button-success" onClick={exportPDF} />
            </Dialog>

            <style jsx>{`
                .reportes-container {
                    width: 100%;
                    height: 100%;
                    background-color: #f4f4f4;
                    overflow-y: auto;
                }
                .report-panel {
                    margin-bottom: 2rem;
                }
                .chart-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .chart-container {
                    flex: 1 1 calc(33.333% - 1rem);
                    max-width: 500px;
                    height: 500px;
                }
            `}</style>
        </div>
    );
};

export default Reportes;
