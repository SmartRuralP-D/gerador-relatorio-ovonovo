import '../assets/styles/MainPage.css';
import { useEffect, useState } from 'react';
import useLogout from '../scripts/logoutScript';
import firebaseService from '../firebase/fAuth';
import loadingGif from '../assets/imagens/loading.gif';
import HeaderOvonovo from '../components/HeaderOvonovo';
import HeaderOasis from '../components/HeaderOasis';
import Card from '../components/Card';
import getAssetIds from '../scripts/getAssetIds';
import getDeviceIds from '../scripts/getDeviceIds';
import getThingsBoardJwt from '../scripts/getThingsBoardJwt';
import getDevicesTelemetry from '../scripts/getDevicesTelemetry';

const MainPage = () => {
    const [firebaseDataStructure, setFirebaseData] = useState({});
    const [authToken, setAuthToken] = useState('');
    const [error, setError] = useState(null);

    const [idsPropriedades, setIdsPropriedades] = useState([]);

    const [unidadesProdutivasOvonovo, setUnidadesProdutivasOvonovo] = useState([]);
    const [unidadesProdutivasOasis, setUnidadesProdutivasOasis] = useState([]);

    const [idsAssetsOvonovo, setIdsAssetsOvonovo] = useState([]);
    const [idsAssetsOasis, setIdsAssetsOasis] = useState([]);

    const [idsDevicesOvonovo, setIdsDevicesOvonovo] = useState({});
    const [idsDevicesOasis, setIdsDevicesOasis] = useState({});

    const [telemetryDataOvonovo, setTelemetryDataOvonovo] = useState({});
    const [telemetryDataOasis, setTelemetryDataOasis] = useState({});


    //useLogout();

    //Requisição dos dados do firebase
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dados do firebase
                const firebaseRootStructure = await firebaseService.getDatabaseInfo();
                setFirebaseData(firebaseRootStructure);

                const [idsAssetsOvonovo, idAssetsOasis] = getAssetIds(firebaseRootStructure);
                const { devicesOvonovo, devicesOasis } = getDeviceIds(firebaseRootStructure);

                const idsPropriedades = Object.keys(firebaseRootStructure.propriedades);
                setIdsPropriedades(idsPropriedades);

                setIdsAssetsOvonovo(idsAssetsOvonovo);
                setIdsAssetsOasis(idAssetsOasis);

                setIdsDevicesOvonovo(devicesOvonovo);
                setIdsDevicesOasis(devicesOasis);


                const unidadesProdutivasOvonovo = Object.entries(firebaseRootStructure.propriedades[idsPropriedades[0]].unidadesProdutivas);
                setUnidadesProdutivasOvonovo(unidadesProdutivasOvonovo);


                const unidadesProdutivasOasis = Object.entries(firebaseRootStructure.propriedades[idsPropriedades[1]].unidadesProdutivas);
                setUnidadesProdutivasOasis(unidadesProdutivasOasis);

                const token = await getThingsBoardJwt(firebaseRootStructure);
                setAuthToken(token);




                const fetchDevicesData = async () => {
                    //extraindo do tb timeseries data dos sensores(devices)
                    console.log("Fetching devices data...");
                    const telemetryDataOvonovo = await getDevicesTelemetry(devicesOvonovo, token);
                    const telemetryDataOasis = await getDevicesTelemetry(devicesOasis, token);

                    setTelemetryDataOvonovo(telemetryDataOvonovo);
                    setTelemetryDataOasis(telemetryDataOasis);

                }


                // Chamar a função de telemetria inicialmente
                await fetchDevicesData();


                const intervalId = setInterval(fetchDevicesData, 120000); // A cada 120 segundos a função é executada.

                // Limpar intervalo quando o componente for desmontado
                return () => {
                    clearInterval(intervalId);
                    console.log("Interval cleared with ID:", intervalId);
                }

            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    //lista de objetos(unidades produtivas)
    const upsOvonovoObject = unidadesProdutivasOvonovo.map(([id, objeto]) => objeto);
    const upsOasisObject = unidadesProdutivasOasis.map(([id, objeto]) => objeto);

    //fetchData retorna html de erro caso não consiga requisitar os dados
    if (error) {
        return <div>Erro: {error}</div>;
    }

    //retorna html de gif de carregamento enquanto o estado dos dados não atualiza
    if (!firebaseDataStructure) {
        return (
            <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                <img src={loadingGif} alt='Loading...' className='gif-image' />
            </div>);
    }

    return (
        <div className='container-xl'>
            <div className='header_cards'>
            <HeaderOvonovo />
            <div className='cards_ovonovo'>
                {upsOvonovoObject.map((unidadeProdutiva, index) => (
                    <Card key={index} unidadeProdutiva={unidadeProdutiva} devicesTelemetry={telemetryDataOvonovo} />
                ))}            </div>
                </div>
                <div className='header_cards'>
            <HeaderOasis />
            <div className='cards_oasis'>
                {upsOasisObject.map((unidadeProdutiva, index) => (
                    <Card key={index} unidadeProdutiva={unidadeProdutiva} devicesTelemetry={telemetryDataOasis} />
                ))}            </div>
                </div>

        </div>
    );
}

export default MainPage;
