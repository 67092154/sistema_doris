import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUploaded, setImageUploaded] = useState(false); 
    const toast = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/productos');
            setProducts(response.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching products', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setSelectedProduct({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: '',
            stock: 0,
            tipo: '',
            imagen_url: null,
            fecha_actualizacion: new Date().toISOString().split('T')[0]
        });
        setImageUploaded(false);
        setIsEdit(false);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const saveProduct = async () => {
        setLoading(true);
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8000/api/productos/${selectedProduct.id}`, {
                    ...selectedProduct,
                    imagen_url: selectedProduct.imagen_url || null
                });
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                await axios.post('http://localhost:8000/api/productos', {
                    ...selectedProduct,
                    imagen_url: selectedProduct.imagen_url || null
                });
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            fetchProducts();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error saving product', life: 3000 });
            }
        } finally {
            setLoading(false);
            setVisible(false);
        }
    };

    const editProduct = (product) => {
        setSelectedProduct({ ...product });
        setImageUploaded(false); 
        setIsEdit(true);
        setVisible(true);
    };

    const deleteProduct = async (product) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/productos/${product.id}`);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            fetchProducts();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const updateProductField = (field, value) => {
        setSelectedProduct({ ...selectedProduct, [field]: value });
    };

    const handleUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', e.files[0]);

        try {
            const response = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            updateProductField('imagen_url', response.data.url);
            setImageUploaded(true); 
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error uploading image', life: 3000 });
        }
    };

    const productDialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </div>
    );

    const filteredProducts = products.filter(product => product.nombre.toLowerCase().includes(filter.toLowerCase()));

    const renderProductImage = (rowData) => (
        <img src={`http://localhost:8000${rowData.imagen_url}`} alt={rowData.nombre} style={{ width: '50px' }} />
    );

    const renderStockIndicator = (rowData) => {
        if (rowData.stock < 10) {
            return <span style={{ color: 'red', fontWeight: 'bold' }}>Stock Bajo</span>;
        }
        return rowData.stock;
    };

    return (
        <div className="inventario-container">
            <Toast ref={toast} />
            <div className="header">
                <InputText value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar por nombre..." />
                <Button label="Agregar Producto" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>

            {loading ? (
                <ProgressSpinner />
            ) : (
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Material de Ferretería">
                        <DataTable value={filteredProducts.filter(p => p.tipo === 'Material de Ferretería')} paginator rows={5}>
                            <Column field="imagen_url" header="Imagen" body={renderProductImage} />
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="descripcion" header="Descripción" sortable />
                            <Column field="precio" header="Precio" body={(rowData) => `${rowData.precio} Bs.`} sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" body={renderStockIndicator} sortable />
                            <Column field="fecha_actualizacion" header="Actualizado" sortable />
                            <Column
                                body={(rowData) => (
                                    <>
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editProduct(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteProduct(rowData)} />
                                    </>
                                )}
                            />
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Autopartes">
                        <DataTable value={filteredProducts.filter(p => p.tipo === 'Autopartes')} paginator rows={5}>
                            <Column field="imagen_url" header="Imagen" body={renderProductImage} />
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="descripcion" header="Descripción" sortable />
                            <Column field="precio" header="Precio" body={(rowData) => `${rowData.precio} Bs.`} sortable />
                            <Column field="categoria" header="Categoría" sortable />
                            <Column field="stock" header="Stock" body={renderStockIndicator} sortable />
                            <Column field="fecha_actualizacion" header="Actualizado" sortable />
                            <Column
                                body={(rowData) => (
                                    <>
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editProduct(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteProduct(rowData)} />
                                    </>
                                )}
                            />
                        </DataTable>
                    </TabPanel>
                </TabView>
            )}

            <Dialog visible={visible} style={{ width: '450px' }} header="Detalles del Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={selectedProduct?.nombre || ''} onChange={(e) => updateProductField('nombre', e.target.value)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText id="descripcion" value={selectedProduct?.descripcion || ''} onChange={(e) => updateProductField('descripcion', e.target.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="precio">Precio</label>
                    <InputNumber id="precio" value={selectedProduct?.precio || 0} onValueChange={(e) => updateProductField('precio', e.value)} required mode="currency" currency="BOB" locale="es-BO" />
                </div>
                <div className="field">
                    <label htmlFor="categoria">Categoría</label>
                    <InputText id="categoria" value={selectedProduct?.categoria || ''} onChange={(e) => updateProductField('categoria', e.target.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="stock">Stock</label>
                    <InputNumber id="stock" value={selectedProduct?.stock || 0} onValueChange={(e) => updateProductField('stock', e.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="tipo">Tipo</label>
                    <Dropdown id="tipo" value={selectedProduct?.tipo || ''} options={[{ label: 'Material de Ferretería', value: 'Material de Ferretería' }, { label: 'Autopartes', value: 'Autopartes' }]} onChange={(e) => updateProductField('tipo', e.value)} required />
                </div>
              
                
                
                    <div className="field">
                        <label htmlFor="imagen_upload">Subir Imagen</label>
                        <FileUpload name="file" url="http://localhost:8000/api/upload" customUpload uploadHandler={handleUpload} mode="basic" accept="image/*" maxFileSize={1000000} auto />
                    </div>
                
                {imageUploaded && (
                    <div className="field">
                        <i className="pi pi-check" style={{ color: 'green', fontSize: '1.5em' }}></i>
                        <p>Imagen subida correctamente</p>
                    </div>
                )}
            </Dialog>

            <style jsx>{`
                .inventario-container {
                    padding: 2rem;
                    background-color: #f4f4f4;
                    overflow-y: auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .field {
                    margin-bottom: 1rem;
                }
                .low-stock {
                    color: red;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default Inventario;
