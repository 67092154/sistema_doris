import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Logo from '../logotropical.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios', life: 3000 });
      return;
    }
    if (!validateEmail(email)) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Correo electrónico no válido', life: 3000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });
      const { id, rol } = response.data;
      localStorage.setItem('user', JSON.stringify({ id, rol }));
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Inicio de sesión exitoso', life: 3000 });
      navigate('/paneldecontrol', { state: { userId: id, userRole: rol } });
  } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas', life: 3000 });
  } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <Toast ref={toast} />
      <Panel header="Inicio de Sesión" style={{ width: '30rem', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img src={Logo} alt="Logo" width="100" style={{ marginBottom: '1rem' }} />
          <h4>Ferretería Tropical</h4>
          <Divider />
        </div>
        <Fieldset legend="Acceso al Sistema">
          <div className="p-fluid" style={{ gap: '1rem' }}>
            <div className="p-field" style={{ marginBottom: '1rem' }}>
              <span className="p-float-label p-input-icon-left">
             
                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">Correo Electrónico</label>
              </span>
            </div>
            <div className="p-field" style={{ marginBottom: '1rem' }}>
              <span className="p-float-label p-input-icon-left">
              
                <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />
                <label htmlFor="password">Contraseña</label>
              </span>
            </div>
            <Button label={loading ? 'Cargando...' : 'Iniciar Sesión'} icon="pi pi-sign-in" onClick={handleLogin} className="p-button-success" style={{ width: '100%', height: '2.5rem' }} disabled={loading} />
            <Button label="Volver a Inicio" icon="pi pi-arrow-left" className="p-button-secondary" style={{ width: '100%', height: '2.5rem', marginTop: '1rem' }} onClick={() => navigate('/')} />
          </div>
        </Fieldset>
      </Panel>
    </div>
  );
};

export default Login;
