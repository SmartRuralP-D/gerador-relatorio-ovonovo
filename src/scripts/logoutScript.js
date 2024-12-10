import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const disconnect = async () => {
            try {
                await signOut(auth);
                navigate('/');
            } catch (error) {
                console.log('Falha ao desconectar.', error);
            }
        };

        disconnect();
    }, [auth, navigate]);
};

export default useLogout;
