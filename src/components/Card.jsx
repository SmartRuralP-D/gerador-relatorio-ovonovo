import poultry from '../assets/imagens/smartrural_poultry_icon.png';
import iconePeixe from '../assets/imagens/smartrural_fish_icon.png';
import '../assets/styles/Card.css';
import { useState, useEffect } from 'react';

const Card = ({ unidadeProdutiva, devicesTelemetry }) => {
    const nome = unidadeProdutiva ? unidadeProdutiva.nome : 'N/A';
    const cultivo = unidadeProdutiva ? unidadeProdutiva.cultivo : 'N/A';

    // parâmetros de telemetria
    const [temperaturas, setTemperaturas] = useState([]);
    const [humidades, setHumidades] = useState([]);

    const [phs, setPhs] = useState([]);
    const [do_cons, setDoCons] = useState([]);
    const [lstm_do_concentrations, setLstmDoConcentrations] = useState([]);
    const [lstm_do_saturations, setLstmDoSaturations] = useState([]);
    const [rf_do_concentrations, setRfDoConcentrations] = useState([]);
    const [rf_do_saturations, setRfDoSaturations] = useState([]);


    useEffect(() => {
        if (devicesTelemetry[nome] && cultivo === 'chicken') {
            const tempValues = [];
            const humValues = [];
            devicesTelemetry[nome].forEach(sensor => {
                if (sensor.data.temperature) {
                    tempValues.push(...sensor.data.temperature.map(temp => temp.value));
                }
                if (sensor.data.humidity) {
                    humValues.push(...sensor.data.humidity.map(hum => hum.value));
                }
            });
            setTemperaturas(tempValues);
            setHumidades(humValues);
        }

        else if (devicesTelemetry[nome] && cultivo === 'fish') {
            const temperatureValues = [];
            const phValues = [];
            const do_conValues = [];
            const lstm_do_concentrationValues = [];
            const lstm_do_saturationValues = [];
            const rf_do_concentrationValues = [];
            const rf_do_saturationValues = [];

            devicesTelemetry[nome].forEach(sensor => {
                if (sensor.data.temperature && sensor.data.ph && sensor.data.do_con && sensor.data.lstm_do_concentration && sensor.data.lstm_do_saturation && sensor.data.rf_do_concentration && sensor.data.rf_do_saturation) {
                    temperatureValues.push(...sensor.data.temperature.map(temp => temp.value));
                    phValues.push(...sensor.data.ph.map(ph => ph.value));
                    do_conValues.push(...sensor.data.do_con.map(do_con => do_con.value));
                    lstm_do_concentrationValues.push(...sensor.data.lstm_do_concentration.map(lstm_do_con => lstm_do_con.value));
                    lstm_do_saturationValues.push(...sensor.data.lstm_do_saturation.map(lstm_do_sat => lstm_do_sat.value));
                    rf_do_concentrationValues.push(...sensor.data.rf_do_concentration.map(rf_do_con => rf_do_con.value));
                    rf_do_saturationValues.push(...sensor.data.rf_do_saturation.map(rf_do_sat => rf_do_sat.value));
                }
            });
            setTemperaturas(temperatureValues);
            setPhs(phValues);
            setDoCons(do_conValues);
            setLstmDoConcentrations(lstm_do_concentrationValues);
            setLstmDoSaturations(lstm_do_saturationValues);
            setRfDoConcentrations(rf_do_concentrationValues);
            setRfDoSaturations(rf_do_saturationValues);

        }
    }, [unidadeProdutiva, devicesTelemetry, nome]);

    // Converte os valores lidos dos dispositivos(string) em float.
    // Calcula a média de valores lidos dos sensores referentes a unidade produtiva atual.
    const calcularMedia = (valores) => {
        const valoresNumericos = valores.map(valor => parseFloat(valor));
        return valoresNumericos.length > 0 ? (valoresNumericos.reduce((acumulador, valor) => acumulador + valor, 0) / valoresNumericos.length).toFixed(3) : 'N/A';
    };


    const mediaTemperatura = calcularMedia(temperaturas);
    const mediaHumidade = calcularMedia(humidades);

    const mediaPh = calcularMedia(phs);
    const mediaDoCon = calcularMedia(do_cons);
    const mediaLstmDoConcentration = calcularMedia(lstm_do_concentrations);
    const mediaLstmDoSaturation = calcularMedia(lstm_do_saturations);
    const mediaRfDoConcentration = calcularMedia(rf_do_concentrations);
    const mediaRfDoSaturation = calcularMedia(rf_do_saturations);
    
    return (
        <div className="card">
            <h1 className='header_card'>{nome}</h1>
            <div className='div_imagem'>
            <img className='imagem' src={cultivo === "chicken" ? poultry : iconePeixe} alt="icone frango/peixe" />
            </div>
            <div className="telemetria">
                <h3 className='header2_card'>Telemetria</h3>
                {cultivo === "chicken" ? (
                    <>
                        <p>Temperatura média: {mediaTemperatura} °C</p>
                        <p>Umidade média: {mediaHumidade} %</p>
                    </>
                ) : (
                    <>
                        <p>Temperatura média: {mediaTemperatura} °C</p>
                        <p>do_con: {mediaDoCon} % </p>
                        <p>PH: {mediaPh} </p>
                        <p>lstm_do_concentration: {mediaLstmDoConcentration} % </p>
                        <p>lstm_do_saturation: {mediaLstmDoSaturation} % </p>
                        <p>rf_do_concentration {mediaRfDoConcentration} % </p>
                        <p>rf_do_saturation {mediaRfDoSaturation} % </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Card;