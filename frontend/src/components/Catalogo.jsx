import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';
import styles from '../styles/Catalogo.module.css';
import Logo from '../logotropical.png';
const endpoint = 'http://localhost:8000/api'; 

const Catalogo = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('ferreteria');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get(`${endpoint}/productos`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error al cargar los productos', error);
            });
    };

    const filteredProducts = products.filter(product =>
        filter === 'ferreteria' ? product.tipo === 'Material de Ferretería' : product.tipo === 'Autopartes'
    );

    const renderProductCard = (product) => (
        <Card title={product.nombre} style={{ width: '300px', margin: '1rem' }} className={styles['product-card']}>
            <img src={`http://localhost:8000${product.imagen_url}`} alt={product.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <p>{product.descripcion}</p>
            <p><strong>Precio:</strong> {parseFloat(product.precio).toFixed(2)} Bs.</p>
        </Card>
    );

    return (
        <div className={styles['catalogo-container']}>
            <nav className={styles.navbar}>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={styles['catalog-title']}>Catálogo</h1>
                <div className={styles['nav-links']}>
                    <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Volver a Inicio</a>
                    <a onClick={() => setFilter('ferreteria')} style={{ cursor: 'pointer', backgroundColor: filter === 'ferreteria' ? '#ff1133' : '', color: filter === 'ferreteria' ? '#ffffff' : '#ff1133' }}>Material de Ferretería</a>
                    <a onClick={() => setFilter('autopartes')} style={{ cursor: 'pointer', backgroundColor: filter === 'autopartes' ? '#ff1133' : '', color: filter === 'autopartes' ? '#ffffff' : '#ff1133' }}>Autopartes</a>
                </div>
            </nav>
            <div className={styles['catalog-content']}>
                <div className={styles['tab-content']}>
                    <div className={styles['product-grid']}>
                        {filteredProducts.map(product => renderProductCard(product))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalogo;
