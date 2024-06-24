import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';
import Logo from '../logotropical.png';
//import '../styles/Pagina.css';

const Pagina = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const seleccionar = () => {
        setVisible(false);
    };

    return (
        <div>
       
            <div className="contenedor-header">
                <header>
                    <div className="header-left">
                        <img src={Logo} alt="Logo" className="logo" />
                        <h1><span className="txtRojo">TROPICAL</span></h1>
                        <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="nav-responsive" />
                    </div>
                    <nav id="nav-links" >
                        <a href="#inicio" onClick={seleccionar}>inicio</a>
                        <a href="#nosotros" onClick={seleccionar}>Nosotros</a>
                        <a href="#galeria" onClick={seleccionar}>Galería</a>
                        <a href="#equipo" onClick={seleccionar}>Ubicación</a>
                        <a href="#contacto" onClick={seleccionar}>Contacto</a>
                        <a onClick={() => navigate('/catalogo')} style={{ cursor: 'pointer' }}>Catálogo</a>
                        <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Acceso</a>
                        
                    </nav>
                  
                </header>
            </div>

            <Sidebar visible={visible} onHide={() => setVisible(false)} className="sidebar">
                <div className="sidebar-item"><a href="#inicio" onClick={seleccionar}>Inicio</a></div>
                <div className="sidebar-item"><a href="#nosotros" onClick={seleccionar}>Nosotros</a></div>
                <div className="sidebar-item"><a href="#galeria" onClick={seleccionar}>Galería</a></div>
                <div className="sidebar-item"><a href="#equipo" onClick={seleccionar}>Ubicación</a></div>
                <div className="sidebar-item"><a href="#contacto" onClick={seleccionar}>Contacto</a></div>
                <div className="sidebar-item" onClick={() => { seleccionar(); navigate('/catalogo'); }} style={{ cursor: 'pointer' }}>Catálogo</div>
                <div className="sidebar-item" onClick={() => { seleccionar(); navigate('/login'); }} style={{ cursor: 'pointer' }}>Acceso</div>
            </Sidebar>

       
            <section id="inicio" className="inicio">
                <div className="contenido-seccion">
                    <div className="info">
                        <h2>FERRETERÍA Y AUTO PARTES <span className="txtRojo">TROPICAL</span></h2>
                        <p>Especialistas en repuesto de autos.</p>
                        <a href="#nosotros" className="btn-mas">
                            <i className="fa-solid fa-circle-chevron-down"></i>
                        </a>
                    </div>
                    <div className="opciones">
                        <div className="opcion">01.TOYOTA</div>
                        <div className="opcion">02.SUZUKI</div>
                        <div className="opcion">03.MITSUBISHI</div>
                        <div className="opcion">04.NISSAN</div>
                        <div className="opcion">05.SUBARU</div>
                        <div className="opcion">06.MAZDA</div>
                    </div>
                </div>
            </section>

            <section id="nosotros" className="nosotros">
                <div className="fila">
                    <div className="col">
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/banner.jpg?v=1697941407633" alt="" />
                    </div>
                    <div className="col">
                        <div className="contenedor-titulo">
                            <div className="numero">01</div>
                            <div className="info">
                                <span className="frase">.</span>
                                <h2>QUIENES SOMOS</h2>
                            </div>
                        </div>
                        <p>Auto Partes Tropical dio inicio a su actividad con una pequeña tienda, alrededor del año 2015; debido al incremento de la demanda de repuestos y al crecimiento del parque automotor del país, fue creciendo a pasos agigantados debido a la variedad de stock con el que cuenta.</p>
                        <div className="contenedor-titulo">
                            <div className="numero">02</div>
                            <div className="info">
                                <span className="frase">.</span>
                                <h2>MISIÓN</h2>
                            </div>
                        </div>
                        <p>Brindar el servicio más completo en la provisión de repuestos y accesorios para vehículos, en el mercado local y nacional, aportando responsablemente al desarrollo económico de nuestro país.</p>
                        <div className="contenedor-titulo">
                            <div className="numero">03</div>
                            <div className="info">
                                <span className="frase">.</span>
                                <h2>VISIÓN</h2>
                            </div>
                        </div>
                        <p>Otorgar al sector automotriz, diferentes opciones en la provisión de sus repuestos y accesorios, ofertándoles piezas originales y alternativas de excelente calidad, según la tendencia del mercado, permitiendo que todos los sectores de la población logren cubrir su necesidad. Reponiendo constantemente el stock, realizando importaciones directas, implementando nuevos servicios y manteniendo la vanguardia en todas las líneas comercializadas.</p>
                    </div>
                </div>
                <hr />
            </section>


            <section className="galeria" id="galeria">
                <div className="contenido-seccion">
                    <div className="contenedor-titulo">
                        <div className="numero">04</div>
                        <div className="info">
                            <span className="frase">LA MEJOR EXPERIENCIA</span>
                            <h2>GALERIA</h2>
                        </div>
                    </div>
                    <div className="contenedor-galeria">
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/amortiguador.jpg?v=1697941390732" className="img-galeria" alt="Amortiguador" />
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/filtros.jpg?v=1697941503711" className="img-galeria" alt="Filtros" />
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/rodamientocorrea.jpg?v=1697941738287" className="img-galeria" alt="Rodamiento" />
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/lubricante.jpg?v=1697941671768" className="img-galeria" alt="Lubricante" />
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/llantass.jpg?v=1697941665610" className="img-galeria" alt="Llantas" />
                        <img src="https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/grasas.jpg?v=1697941614992" className="img-galeria" alt="Grasas" />
                    </div>
                </div>
            </section>

  
            <section className="equipo" id="equipo">
                <div className="contenido-seccion">
                    <div className="contenedor-titulo">
                        <div className="numero">05</div>
                        <div className="info">
                            <span className="frase"></span>
                            <h2>Ubicación</h2>
                        </div>
                    </div>
                    <br /><br /><br />
                    <center>
                        <div id="main">
                            <div className="container">
                                <div id="banner"></div>
                            </div>
                            <div className="container">
                                <section>
                                    <header>
                                        <h2>UBICACIÓN EN EL MAPA</h2>
                                        <h4>Nos ubicamos en el departamento de La Paz, Provincia Sud Yungas, Distrito Palos Blancos, comunidad Inicua.</h4>
                                    </header>
                                    <i className="fa-solid fa-location-dot"></i>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d880.1712425445357!2d-67.2186412081065!3d-15.495288934541243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e01ac6198aec67%3A0x484e522807fbb9fa!2sTienda+Zulemar!5e1!3m2!1ses!2sbo!4v1555292591451!5m2!1ses!2sbo" width="600" height="450" frameBorder="0" style={{ border: 0 }} allowFullScreen=""></iframe>
                                </section>
                            </div>
                        </div>
                    </center>
                </div>
            </section>

         
            <section className="contacto" id="contacto">
                <div className="contenido-seccion">
                    <div className="contenedor-titulo">
                        <div className="numero">06</div>
                        <div className="info">
                            <span className="frase">LA MEJOR EXPERIENCIA</span>
                            <h2>CONTACTO</h2>
                        </div>
                    </div>
                    <div className="fila">
                        <div className="col">
                            <input type="text" placeholder="Ingrese Email" />
                        </div>
                        <div className="col">
                            <input type="text" placeholder="Ingrese Nombre" />
                        </div>
                    </div>
                    <div className="mensaje">
                        <textarea name="" id="" cols="30" rows="10" placeholder="Ingresa el Mensaje"></textarea>
                        <button href="index.html">Enviar Mensaje</button>
                    </div>
                    <div className="fila-datos">
                        <div className="col">
                            <i className="fa-solid fa-location-dot"></i>
                            Avenida La Paz - Beni
                        </div>
                        <div className="col">
                            <i className="fa-solid fa-phone"></i>
                            <a href="tel:+59167092154">67092154</a>
                        </div>
                        <div className="col">
                            <i className="fa-regular fa-clock"></i>
                            Lunes a Domingo, 8:00h - 21:00h
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="info">
                    <p>2023 - <span className="txtRojo">FERRETERÍA Y AUTO PARTES</span> TROPICAL</p>
                    <div className="redes">
                        {/* Redes sociales */}
                    </div>
                </div>
            </footer>
            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;400;600;800;900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Barlow";
}

html {
    scroll-behavior: smooth;
}

body {
    background-color: #dde1e9;
}

.contenedor-header {
    width: 100%;
    position: fixed;
    border-bottom: 1px solid #1f283e;
    background-color: rgba(0, 0, 0, .7);
    z-index: 99;
    padding: 0 20px;
    overflow: hidden; /* Asegura que el contenido no se desborde */
}

.contenedor-header header {
    max-width: 1100px;
    margin: auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0; /* Reduce padding for better fit */
    color: #ffffff;
    flex-wrap: wrap; /* Permite que el contenido se ajuste en varias líneas si es necesario */
}

.header-left {
    display: flex;
    align-items: center;
}

.logo {
    height: 40px; /* Ajusta la altura para un mejor ajuste */
    margin-right: 10px;
}

.navbar-title {
    flex-grow: 1;
    text-align: center;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 10px; /* Espaciado entre elementos del menú */
}

.nav-responsive {
    display: none;
    font-size: 25px;
}

/* Estilos del sidebar */
.sidebar {
    background-color: #151623;
    color: #fff;
}

.sidebar .sidebar-item {
    padding: 20px;
    font-size: 18px;
    border-bottom: 1px solid #ffffff;
    text-align: center;
}

.sidebar .sidebar-item a {
    color: #ffffff;
    text-decoration: none;
}

.sidebar .sidebar-item a:hover {
    color: #ff1133;
}

.txtRojo {
    color: #ff1133;
}

.contenedor-header header nav a {
    display: inline-block;
    text-decoration: none;
    color: #ffffff;
    padding: 5px;
    text-transform: uppercase;
}

.contenedor-header header nav a:hover {
    color: #ff1133;
}

.contenedor-header header .redes a {
    text-decoration: none;
    color: #ffffff;
    display: inline-block;
    padding: 5px 8px;
}

.contenedor-header header .redes a:hover {
    color: #ff1133;
}

.inicio {
    height: 100vh;
    background: linear-gradient(rgba(0, 1, 3, 0.5), rgba(0, 0, 0, .7)), url(https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/banner.jpg?v=1697941407633);
    background-size: cover;
    background-position: center center;
    color: #ffffff;
    position: relative;
}

.inicio .contenido-seccion {
    max-width: 1100px;
    margin: auto;
}

.inicio .info {
    width: fit-content;
    margin: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.inicio .info h2 {
    font-size: 4rem;
    letter-spacing: 3px;
}

.inicio .info p {
    margin: 20px;
    color: #797e8e;
    font-size: 16px;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.inicio .info .btn-mas {
    width: 50px;
    margin: auto;
    height: 50px;
    border: 2px solid #ff1133;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #ff1133;
    margin-top: 50px;
    text-decoration: none;
}

.opciones {
    position: absolute;
    display: flex;
    justify-content: space-between;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
}

.inicio .opciones .opcion {
    border-top: 2px solid #797e8e;
    padding: 7px;
    color: #797e8e;
    margin: 0 20px;
}

.nosotros {
    max-width: 1100px;
    margin: auto;
    height: 100vh;
    background-color: #dde1e9;
    padding: 100px 20px;
}

.nosotros .fila {
    display: flex;
    align-items: center;
}

.nosotros .fila .col {
    width: 50%;
}

.nosotros .fila .col img {
    width: 80%;
    display: block;
    margin: auto;
    margin-bottom: 50px;
}

.nosotros .fila .col .contenedor-titulo {
    display: flex;
    align-items: center;
}

.nosotros .fila .col .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.nosotros .fila .col .contenedor-titulo .info {
    margin-left: 30px;
}

.nosotros .fila .col .contenedor-titulo .info .frase {
    color: #ff1133;
}

.nosotros .fila .col .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.nosotros .fila .col p {
    margin-bottom: 10px;
    line-height: 28px;
}

.nosotros .fila .col .p-especial {
    font-weight: bold;
}

.nosotros hr {
    margin-bottom: 30px;
}

.nosotros .fila-nosotros {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nosotros .fila-nosotros .frase {
    font-size: 18px;
    font-weight: 600;
}

.nosotros .fila-nosotros h2 {
    font-size: 2.5rem;
}

.nosotros .fila-nosotros button {
    background-color: #ff1133;
    border: none;
    color: #ffffff;
    padding: 15px 35px;
    font-size: 14px;
    letter-spacing: 3px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

.servicios {
    color: #ffffff;
    position: relative;
}

.servicios .contenido-seccion {
    background: linear-gradient(rgba(0, 14, 41, 0.6), rgba(0, 7, 78, 0.7));
    background-size: cover;
    background-position: center center;
    margin: auto;
    padding: 0 20px;
}

.servicios .contenido-seccion .fila {
    max-width: 1100px;
    margin: auto;
    display: flex;
    align-items: center;
    padding: 100px 0;
}

.servicios .contenido-seccion .fila .col {
    width: 50%;
}

.servicios .contenido-seccion .fila .col img {
    display: block;
    width: 50%;
    margin: auto;
}

.servicios .fila .col .contenedor-titulo {
    display: flex;
    align-items: center;
}

.servicios .fila .col .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.servicios .fila .col .contenedor-titulo .info {
    margin-left: 30px;
}

.servicios .fila .col .contenedor-titulo .info .frase {
    color: #ff1133;
}

.servicios .fila .col .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.servicios .fila .col p {
    margin-bottom: 10px;
    line-height: 28px;
}

.servicios .fila .col .p-especial {
    font-weight: bold;
}

.servicios .info-servicios {
    max-width: 800px;
    margin: auto;
}

.servicios .info-servicios table {
    text-align: center;
    background-color: #ffffff;
    color: #1f283e;
    border-collapse: collapse;
    position: relative;
    bottom: 100px;
}

.servicios .info-servicios table td {
    padding: 30px;
    border: 1px solid #dde1e9;
}

.servicios .info-servicios table td i {
    color: #ff1133;
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.servicios .info-servicios h3 {
    margin-bottom: 20px;
    text-transform: uppercase;
}

.servicios .info-servicios p {
    line-height: 30px;
}

.comodidades {
    max-width: 1100px;
    margin: auto;
    background-color: #dde1e9;
    padding: 100px 20px;
}

.comodidades .fila {
    display: flex;
    align-items: center;
}

.comodidades .fila .col {
    width: 50%;
}

.comodidades .fila .col img {
    width: 80%;
    display: block;
    margin: auto;
    margin-bottom: 50px;
}

.comodidades .fila .col .contenedor-titulo {
    display: flex;
    align-items: center;
}

.comodidades .fila .col .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.comodidades .fila .col .contenedor-titulo .info {
    margin-left: 30px;
}

.comodidades .fila .col .contenedor-titulo .info .frase {
    color: #ff1133;
}

.comodidades .fila .col .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.comodidades .fila .col p {
    margin-bottom: 10px;
    line-height: 28px;
}

.comodidades .fila .col .p-especial {
    font-weight: bold;
}

.comodidades .fila .col li {
    margin-bottom: 20px;
    color: #1f283e;
}

.comodidades .fila .col li span {
    font-weight: bold;
    color: #ff1133;
}

.galeria {
    color: #fff;
    background: linear-gradient(rgba(0, 14, 41, 0.6), rgba(0, 7, 78, 0.7)), url(https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/banner.jpg?v=1697941407633);
    background-size: cover;
    background-position: center center;
    padding: 100px 0;
}

.galeria .contenido-seccion {
    max-width: 1100px;
    margin: auto;
    padding: 0 20px;
}

.galeria .contenedor-titulo {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
}

.galeria .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.galeria .contenedor-titulo .info {
    margin-left: 30px;
}

.galeria .contenedor-titulo .info .frase {
    color: #ff1133;
}

.galeria .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.galeria .fila {
    display: flex;
}

.galeria .fila .col img {
    width: 100%;
    display: block;
}

.equipo {
    max-width: 1100px;
    margin: auto;
    padding-top: 95px;
    background-color: #dde1e9;
}

.equipo .contenedor-titulo {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: auto;
}

.equipo .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.equipo .contenedor-titulo .info {
    margin-left: 30px;
}

.equipo .contenedor-titulo .info .frase {
    color: #ff1133;
}

.equipo .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.equipo .fila {
    margin: 50px 0;
    display: flex;
    justify-content: space-around;
}

.equipo .fila .col {
    width: 25%;
}

.equipo .fila .col img {
    max-height: 400px;
    display: block;
    margin: auto;
}

.equipo .fila .info {
    border: 5px solid #1f283e;
    text-align: center;
    border-radius: 5px;
    padding: 20px;
    background: linear-gradient(#ff1133, #9a0e23);
    color: #fff;
}

.equipo .fila .info p {
    margin: 20px 0;
}

.equipo .fila .info a {
    color: #fff;
    text-decoration: none;
    display: inline-block;
    margin: 0 20px;
    font-size: 20px;
}

.contacto {
    color: #fff;
    background: linear-gradient(rgba(0, 14, 41, 0.6), rgba(0, 7, 78, 0.7)), url(https://cdn.glitch.global/540deb16-0a26-4694-88dd-2b1415d1f0e3/banner.jpg?v=1697941407633);
    background-size: cover;
    background-position: center center;
    padding: 100px 20px;
}

.contacto .contenido-seccion {
    max-width: 800px;
    margin: auto;
}

.contacto .contenedor-titulo {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: auto;
}

.contacto .contenedor-titulo .numero {
    color: #ff1133;
    font-weight: bold;
    display: block;
    font-size: 5rem;
}

.contacto .contenedor-titulo .info {
    margin-left: 30px;
}

.contacto .contenedor-titulo .info .frase {
    color: #ff1133;
}

.contacto .contenedor-titulo .info h2 {
    font-size: 3rem;
}

.contacto .fila {
    display: flex;
    margin-top: 50px;
    justify-content: space-between;
}

.contacto .fila .col {
    width: 48%;
}

.contacto .fila input {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    outline: none;
}

.contacto textarea {
    display: block;
    margin-top: 20px;
    padding: 15px;
    font-size: 20px;
    outline: none;
    width: 100%;
    height: 200px;
}

.contacto button {
    display: block;
    width: fit-content;
    margin: auto;
    margin-top: 30px;
    border: none;
    background-color: #ff1133;
    color: #fff;
    font-size: 18px;
    padding: 10px 25px;
    border-radius: 5px;
    cursor: pointer;
}

.contacto .fila-datos {
    display: flex;
    justify-content: space-around;
    margin-top: 100px;
    font-size: 18px;
    text-align: center;
}

.contacto i {
    color: #ff1133;
    display: inline-block;
    margin-right: 10px;
}

footer {
    background-color: #151623;
    padding: 30px 0;
}

footer .info {
    display: flex;
    max-width: 1100px;
    margin: auto;
    justify-content: space-between;
    padding: 0 20px;
}

footer .info p {
    color: #797e8e;
}

footer .info a {
    text-decoration: none;
    color: #797e8e;
    display: inline-block;
    margin: 0 15px;
}

@media only screen and (max-width: 900px) {
    header nav{
        position: initial;
        display: none;
        transform: translate(0);
    }
    
    .nav-links {
        display: none; /* Oculta los enlaces del menú en dispositivos móviles */
    }

    .nav-responsive {
        display: block; /* Muestra el icono de hamburguesa en dispositivos móviles */
    }

    .contenedor-header header {
        flex-direction: row;
        align-items: center;
    }

    nav.responsive {
        display: flex;
        flex-direction: column;
        justify-content: start;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        background-color: #151623;
        z-index: 99;
    }

    nav.responsive a {
        display: block;
        width: fit-content;
        margin: 10px auto;
        font-size: 20px; 
    }

    .inicio .opciones {
        display: none;
    }

    .nosotros .fila {
        display: block;
    }

    .nosotros .fila .col {
        width: 100%;
        margin: auto;
    }

    .nosotros .fila .col img {
        max-width: 200px;
        display: block;
        margin: auto;
    }

    .servicios .contenido-seccion .fila {
        display: block;
    }

    .servicios .contenido-seccion .fila .col {
        width: 100%;
    }

    .comodidades .fila {
        display: block;
    }

    .comodidades .fila .col {
        width: 100%;
    }

    .comodidades .fila .col img {
        max-width: 200px;
    }

    .equipo .fila {
        display: block;
    }

    .equipo .fila .col {
        width: 100%;
        margin-bottom: 20px;
    }

    .equipo .fila .col img {
        max-height: 200px;
    }

    .equipo .fila .info {
        max-width: 250px;
        margin: auto;
    }

    .contacto .fila {
        display: block;
    }

    .contacto .fila .col {
        width: 100%;
        margin-bottom: 20px;
    }

    .contacto .fila-datos {
        display: block;
    }

    .contacto .fila-datos .col {
        margin-bottom: 20px;
    }

    footer .info {
        display: block;
        text-align: center;
    }

    footer .info p {
        margin-bottom: 10px;
    }
}

.contenedor-galeria {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin-top: 30px;
}

.img-galeria {
    width: 30%;
    display: block;
    margin-bottom: 15px;
    box-shadow: 0 0 6px rgba(0, 0, 0, .6);
    cursor: pointer;
}

.imagen-light {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.534);
    transform: translate(100%);
    transition: transform .2s ease-in-out;
}

.btn {
    text-align: center;
    padding: 40px 50px;
    border: none;
    background-color: #017bab;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
            `}</style>
        </div>
    );
};

export default Pagina;
