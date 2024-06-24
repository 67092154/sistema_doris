import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

const endpoint = 'http://localhost:8000/api';

const VentasAutopartes = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pdfVisible, setPdfVisible] = useState(false); 
    const [pdfUrl, setPdfUrl] = useState(''); 
    const [customerName, setCustomerName] = useState('');
    const [customerLastName, setCustomerLastName] = useState('');
    const [customerCI, setCustomerCI] = useState('');
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]); 
    const toast = useRef(null);
    const ciInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchSales(); 
    }, []);

    const fetchProducts = () => {
        axios.get(`${endpoint}/productos`)
            .then(response => {
                const autopartes = response.data.filter(product => product.tipo === 'Autopartes');
                setProducts(autopartes);
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos' });
            });
    };

    const fetchSales = () => {
        axios.get(`${endpoint}/ventas_autopartes`)
            .then(response => {
                setSales(response.data);
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las ventas' });
            });
    };

    useEffect(() => {
        if (visible && ciInputRef.current) {
            ciInputRef.current.focus();
        }
    }, [visible]);

    const addToCart = (product) => {
        if (quantity > product.stock) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Stock insuficiente' });
            return;
        }

        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            if (existingProduct.quantity + quantity > product.stock) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Stock insuficiente' });
                return;
            }
            existingProduct.quantity += quantity;
            setSelectedProducts([...selectedProducts]);
        } else {
            const newProduct = { ...product, quantity };
            setSelectedProducts([...selectedProducts, newProduct]);
        }

        product.stock -= quantity;
        setProducts([...products]);

        toast.current.show({ severity: 'success', summary: 'Producto añadido', detail: `${product.nombre} añadido al carrito` });
        setQuantity(1);
    };

    const updateQuantity = (product, newQuantity) => {
        product.quantity = newQuantity;
        setSelectedProducts([...selectedProducts]);
    };

    const removeFromCart = (product) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    };

    const handleCISearch = (e) => {
        const ci = e.target.value;
        setCustomerCI(ci);
        if (ci.length > 0) {
            axios.get(`${endpoint}/ventas_autopartes/clientes/${ci}`)
                .then(response => {
                    if (response.data) {
                        setCustomerName(response.data.nombre);
                        setCustomerLastName(response.data.apellido);
                    } else {
                        setCustomerName('');
                        setCustomerLastName('');
                    }
                })
                .catch(error => {
                    setCustomerName('');
                    setCustomerLastName('');
                });
        }
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cobrar" icon="pi pi-money-bill" onClick={() => setConfirmVisible(true)} />
                <Button label="Agregar Más" icon="pi pi-plus" onClick={() => setVisible(false)} className="p-button-secondary" />
                <Button label="Cancelar" icon="pi pi-times" onClick={clearCart} className="p-button-danger" />
            </div>
        );
    };

    const clearCart = () => {
        setSelectedProducts([]);
        setVisible(false);
    };

    const resetForm = () => {
        setCustomerName('');
        setCustomerLastName('');
        setCustomerCI('');
        setSelectedProducts([]);
        setQuantity(1);
    };

    const confirmSale = () => {
        const ventas = selectedProducts.map(product => ({
            producto_id: product.id,
            cantidad: product.quantity,
            total: (product.precio * product.quantity).toFixed(2),
            cliente_nombre: customerName,
            cliente_apellido: customerLastName,
            cliente_ci: customerCI,
        }));

        axios.post(`${endpoint}/ventas_autopartes/confirm`, { ventas })
            .then(response => {
                setConfirmVisible(false);
                setPdfUrl(response.data.pdf_url); 
                setPdfVisible(true); 
                resetForm();
                setVisible(false);
                fetchProducts();
                fetchSales(); 
                toast.current.show({ severity: 'success', summary: 'Venta Realizada', detail: 'La venta se realizó correctamente.' });
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.error || 'No se pudo realizar la venta' });
            });
    };

    const renderProductImage = (rowData) => (
        <img src={`http://localhost:8000${rowData.imagen_url}`} alt={rowData.nombre} style={{ width: '50px' }} />
    );

    return (
        <div className="ventas-container">
            <Toast ref={toast} />
            <h1>Venta de Autopartes</h1>

            <TabView>
                <TabPanel header="Realizar Venta">
                    <DataTable value={products} responsiveLayout="scroll">
                       
                        <Column field="nombre" header="Nombre" body={(rowData) => (
                            <>
                                {renderProductImage(rowData)}
                                <span>{rowData.nombre}</span>
                            </>
                        )} />
                        <Column field="descripcion" header="Descripción" />
                        <Column field="precio" header="Precio" body={(rowData) => `${parseFloat(rowData.precio).toFixed(2)} Bs.`} />
                        <Column field="stock" header="Stock" />
                        <Column header="Cantidad" body={(rowData) => (
                            <InputNumber value={quantity} onValueChange={(e) => setQuantity(e.value)} min={1} max={rowData.stock} />
                        )} />
                        <Column header="Acción" body={(rowData) => (
                            <Button label="Añadir" icon="pi pi-shopping-cart" onClick={() => addToCart(rowData)} />
                        )} />
                    </DataTable>

                    <div className="cart-button-container">
                        <Button label="Finalizar Venta" icon="pi pi-check" onClick={() => setVisible(true)} className="p-button-success" />
                        <Badge value={selectedProducts.length} severity="info" />
                    </div>
                </TabPanel>
                
                <TabPanel header="Ventas Realizadas">
                    <DataTable value={sales} responsiveLayout="scroll">
                        <Column field="producto.nombre" header="Producto" />
                        <Column field="cantidad" header="Cantidad" />
                        <Column field="total" header="Total" body={(rowData) => `${parseFloat(rowData.total).toFixed(2)} Bs.`} />
                        <Column field="cliente_nombre" header="Cliente" />
                        <Column field="cliente_ci" header="C.I." />
                        <Column field="fecha_venta" header="Fecha de Venta" body={(rowData) => new Date(rowData.fecha_venta).toLocaleDateString()} />
                    </DataTable>
                </TabPanel>
            </TabView>

            <Dialog header="Resumen de Venta" visible={visible} footer={renderFooter} onHide={() => setVisible(false)}>
                <div className="customer-info">
                    <h3>Datos del Cliente</h3>
                    <InputText ref={ciInputRef} placeholder="C.I." value={customerCI} onChange={handleCISearch} onKeyPress={(e) => { if (e.key === 'Enter') handleCISearch(e); }} />
                    <InputText placeholder="Nombre" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <InputText placeholder="Apellido" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} />
                </div>
                <DataTable value={selectedProducts} responsiveLayout="scroll">
                    <Column field="nombre" header="Nombre" />
                    <Column field="quantity" header="Cantidad" body={(rowData) => (
                        <InputNumber value={rowData.quantity} onValueChange={(e) => updateQuantity(rowData, e.value)} min={1} max={rowData.stock} />
                    )} />
                    <Column field="precio" header="Precio" body={(rowData) => `${parseFloat(rowData.precio).toFixed(2)} Bs.`} />
                    <Column field="subtotal" header="Subtotal" body={(rowData) => `${(rowData.precio * rowData.quantity).toFixed(2)} Bs.`} />
                    <Column header="Acción" body={(rowData) => (
                        <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={() => removeFromCart(rowData)} />
                    )} />
                </DataTable>
                <div className="total">
                    <h3>Total: {selectedProducts.reduce((acc, product) => acc + product.precio * product.quantity, 0).toFixed(2)} Bs.</h3>
                </div>
            </Dialog>

            <Dialog header="Confirmación de Venta" visible={confirmVisible} onHide={() => setConfirmVisible(false)} footer={
                <div>
                    <Button label="Sin Recibo" icon="pi pi-times" onClick={() => {confirmSale(); setPdfVisible(false);}} className="p-button-secondary" />
                    <Button label="Sí" icon="pi pi-check" onClick={confirmSale} />
                </div>
            }>
                <div className="confirmation">
                    <i className="pi pi-check-circle" style={{ fontSize: '2em', color: 'green' }}></i>
                    <p>¿Desea imprimir el recibo?</p>
                </div>
            </Dialog>

            <Dialog header="Recibo" visible={pdfVisible} onHide={() => setPdfVisible(false)}>
                <iframe src={pdfUrl} width="100%" height="500px"></iframe>
            </Dialog>

            <style jsx>{`
                .ventas-container {
                    padding: 0;
                    background-color: #f4f4f4;
                    overflow-y: auto;
                }
                .p-datatable .p-datatable-tbody > tr > td {
                    vertical-align: middle;
                }
                .p-datatable .p-datatable-tbody > tr > td > img {
                    margin-right: 1rem;
                }
                .p-button-success {
                    background-color: #4CAF50;
                    border-color: #4CAF50;
                }
                .cart-button-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .customer-info {
                    margin-bottom: 2rem;
                }
                .customer-info h3 {
                    margin-bottom: 1rem;
                }
                .customer-info .p-inputtext {
                    width: 100%;
                    margin-bottom: 1rem;
                }
                .total {
                    margin-top: 1rem;
                    text-align: right;
                }
                .confirmation {
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default VentasAutopartes;
