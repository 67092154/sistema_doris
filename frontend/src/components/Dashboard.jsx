import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { SpeedDial } from 'primereact/speeddial';
import { Avatar } from 'primereact/avatar';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';
import styles from '../styles/Dashboard.module.css';
import Bienvenida from './Bienvenida';
import VentasFerreteria from './panels/VentasFerreteria';
import Inventario from './panels/Inventario';
import Reportes from './panels/Reportes';
import Usuarios from './panels/Usuario';
import VentasAutopartes from './panels/VentasAutopartes';
import Logo from '../logotropical.png';
import axios from 'axios';

const Dashboard = () => {
    const toast = useRef(null);
    const messages = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, userRole } = location.state || {};
    const [showSpeedDial, setShowSpeedDial] = useState(false);
    const [activeComponent, setActiveComponent] = useState('bienvenida');
    const [user, setUser] = useState(null);

    const menuItems = [
        {
            label: 'Ventas',
            icon: 'pi pi-fw pi-shopping-cart',
            items: [
                { label: 'Material de Ferretería', icon: 'pi pi-fw pi-box', command: () => setActiveComponent('ventasFerreteria') },
                { label: 'Material de Autopartes', icon: 'pi pi-fw pi-car', command: () => setActiveComponent('ventasAutopartes') }
            ]
        },
        {
            label: 'Inventario',
            icon: 'pi pi-fw pi-briefcase',
            command: () => setActiveComponent('inventario'),
            visible: userRole === 'Admin'
        },
        {
            label: 'Reportes',
            icon: 'pi pi-fw pi-chart-line',
            command: () => setActiveComponent('reportes'),
            visible: userRole === 'Admin'
        },
        {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-user',
            command: () => setActiveComponent('usuarios'),
            visible: userRole === 'Admin'
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-fw pi-sign-out',
            command: () => handleLogout()
        }
    ].filter(item => item.visible !== false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setShowSpeedDial(true);
        } else {
            setShowSpeedDial(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!userId || !userRole) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/usuarios/${userId}`);
                setUser(response.data);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos del usuario' });
            }
        };

        fetchUser();
    }, [userId, userRole, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'bienvenida':
                return <Bienvenida />;
            case 'ventasFerreteria':
                return <VentasFerreteria />;
            case 'ventasAutopartes':
                return <VentasAutopartes />;
            case 'inventario':
                return userRole === 'Admin' ? <Inventario /> : null;
            case 'reportes':
                return userRole === 'Admin' ? <Reportes /> : null;
            case 'usuarios':
                return userRole === 'Admin' ? <Usuarios /> : null;
            default:
                return null;
        }
    };

    const start = <img alt="logo" src={Logo} height="40" className="mr-2"></img>;

    const end = (
        <div className="flex align-items-center">
            {user && (
                <>
                    <Avatar image={`http://localhost:8000${user.foto}`} shape="circle" />
                    <span className="ml-2">{user.nombre}</span>
                </>
            )}
        </div>
    );

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles['dashboard-header']}>
                <Menubar model={menuItems} className={styles.menubar} start={start} end={end} />
            </div>

            <Toast ref={toast} />
            <Messages ref={messages} />

            <div className={styles['dashboard-content']}>
                {renderComponent()}
            </div>

            {showSpeedDial && (
                <SpeedDial model={menuItems} direction="up" className={styles['speed-dial']} buttonClassName="p-button-success" />
            )}
            <style jsx>{`
                .dashboard-container {
    padding: 0;
    background-color: #f4f4f4;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0;
    width: 100%;
}

.menubar {
    width: 100%;
  
}

.dashboard-content {
    width: 100%;
    margin: 0;
   
    box-sizing: border-box;
}

.speed-dial {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}

            `}</style>
        </div>
    );
};

export default Dashboard;
