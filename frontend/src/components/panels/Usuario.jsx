import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const toast = useRef(null);

    const roles = [{ label: 'Admin', value: 'Admin' }, { label: 'Vendedor', value: 'Vendedor' }];
    const statuses = [{ label: 'Activo', value: 'Activo' }, { label: 'Inactivo', value: 'Inactivo' }];

    const endpoint = 'http://localhost:8000/api';

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${endpoint}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setSelectedUsuario({ nombre: '', email: '', rol: null, estado: 'Activo', password: '', foto: '' });
        setImagePreview(null);
        setIsEdit(false);
        setIsDialogVisible(true);
    };

    const hideDialog = () => {
        setIsDialogVisible(false);
    };

    const saveUsuario = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('nombre', selectedUsuario.nombre);
        formData.append('email', selectedUsuario.email);
        formData.append('password', selectedUsuario.password);
        formData.append('rol', selectedUsuario.rol);
        formData.append('estado', selectedUsuario.estado);

        if (selectedUsuario.foto && !isEdit) {
            formData.append('foto', selectedUsuario.foto);
        }

        try {
            if (isEdit) {
               
                const data = {
                    nombre: selectedUsuario.nombre,
                    email: selectedUsuario.email,
                    rol: selectedUsuario.rol,
                    estado: selectedUsuario.estado,
                    password: selectedUsuario.password
                };
                await axios.put(`${endpoint}/usuarios/${selectedUsuario.id}`, data);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Actualizado', life: 3000 });
            } else {
                await axios.post(`${endpoint}/usuarios`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado', life: 3000 });
            }
            fetchUsuarios();
            setIsDialogVisible(false);
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar usuario', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const editUsuario = (usuario) => {
        setSelectedUsuario({ ...usuario, password: '' });
        setImagePreview(usuario.foto ? `http://localhost:8000${usuario.foto}` : null);
        setIsEdit(true);
        setIsDialogVisible(true);
    };

    const deleteUsuario = async (usuario) => {
        setLoading(true);
        try {
            await axios.delete(`${endpoint}/usuarios/${usuario.id}`);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Eliminado', life: 3000 });
            fetchUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const activateUsuario = async (usuario) => {
        setLoading(true);
        try {
            const updatedUsuario = { ...usuario, estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo' };
            await axios.put(`${endpoint}/usuarios/${usuario.id}`, updatedUsuario);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Usuario ${updatedUsuario.estado === 'Activo' ? 'Activado' : 'Desactivado'}`, life: 3000 });
            fetchUsuarios();
        } catch (error) {
            console.error('Error al activar/desactivar usuario:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al activar/desactivar usuario', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const updateUsuarioField = (field, value) => {
        setSelectedUsuario({ ...selectedUsuario, [field]: value });
    };

    const onImageSelect = (e) => {
        const file = e.files[0];
        setSelectedUsuario({ ...selectedUsuario, foto: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        return (
            usuario.nombre.toLowerCase().includes(search.toLowerCase())
        );
    });

    const usuarioDialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUsuario} disabled={loading}>
                {loading && <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="8" />}
            </Button>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <>
            <Tooltip target=".p-button-rounded" />
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editUsuario(rowData)} tooltip="Editar" />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => deleteUsuario(rowData)} tooltip="Eliminar" />
         
        </>
    );

    const fotoBodyTemplate = (rowData) => (
        <img src={rowData.foto ? `http://localhost:8000${rowData.foto}` : 'https://via.placeholder.com/50'} alt={rowData.nombre} className="user-image" />
    );

    const passwordBodyTemplate = (rowData) => (
        <span>{rowData.password_plain}</span>
    );

    return (
        <div className="usuarios-container">
            <Toast ref={toast} />
            <Panel header="Gestión de Usuarios" className="usuarios-panel">
                <div className="header">
                    <div className="search-container">
                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre..." />
                    </div>
                    <Button label="Agregar Usuario" icon="pi pi-plus" className="p-button-success add-user-button" onClick={openNew} />
                </div>
                {loading ? (
                    <div className="loader-container">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <DataTable value={filteredUsuarios} paginator rows={5} responsiveLayout="scroll">
                        <Column field="foto" header="Foto" body={fotoBodyTemplate} />
                        <Column field="nombre" header="Nombre" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="rol" header="Rol" sortable />
                        <Column field="estado" header="Estado" sortable />
                        <Column field="password_plain" header="Contraseña" body={passwordBodyTemplate} sortable />
                        <Column body={actionBodyTemplate} />
                    </DataTable>
                )}
            </Panel>

            <Dialog visible={isDialogVisible} style={{ width: '450px' }} header="Detalles del Usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={selectedUsuario?.nombre || ''} onChange={(e) => updateUsuarioField('nombre', e.target.value)} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={selectedUsuario?.email || ''} onChange={(e) => updateUsuarioField('email', e.target.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="password">Contraseña</label>
                    <Password id="password" value={selectedUsuario?.password || ''} onChange={(e) => updateUsuarioField('password', e.target.value)} toggleMask required />
                </div>
                <div className="field">
                    <label htmlFor="rol">Rol</label>
                    <Dropdown id="rol" value={selectedUsuario?.rol || ''} options={roles} onChange={(e) => updateUsuarioField('rol', e.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="estado">Estado</label>
                    <Dropdown id="estado" value={selectedUsuario?.estado || ''} options={statuses} onChange={(e) => updateUsuarioField('estado', e.value)} required />
                </div>
                <div className="field">
                    <label htmlFor="foto">Foto de Perfil</label>
                    <FileUpload name="foto" customUpload uploadHandler={onImageSelect} mode="basic" accept="image/*" maxFileSize={1000000} auto />
                    {imagePreview && <img src={imagePreview} alt="Previsualización" className="image-preview" />}
                </div>
            </Dialog>

            <style jsx>{`
                .usuarios-container {
                    padding: 0;
                    background-color: #f4f4f4;
                    overflow-y: auto;
                }
                .usuarios-panel {
                    width: 100%;
                    height: 100%;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                }
                .search-container {
                    flex: 1;
                    margin-right: 1rem;
                }
                .add-user-button {
                    flex-shrink: 0;
                }
                .filters {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                }
                .field {
                    margin-bottom: 1rem;
                }
                .user-image {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                }
                .loader-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }
                .image-preview {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
};

export default Usuarios;
