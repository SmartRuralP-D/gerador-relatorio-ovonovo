import iconeGalinhaBranco from '../assets/imagens/SmartRuralLogoGalinhaBranco.svg';
import logoOvonovo from '../assets/imagens/imagem_OvoNovo.png';
import '../assets/styles/Header.css';


const HeaderOvonovo = () => {
    return (
        <div className="horizontal-card-ovonovo">
            <img src={iconeGalinhaBranco} style={{height: '100px', width: ''}} alt="logo galinha" className="card-image logosmart"/>
            <h1 className='titulo'>Ovonovo</h1>
            <img src={logoOvonovo} style={{ width: '200px', height: '50px', marginTop: '10px'}} alt="logo ovonovo" className="card-image ovonovo"/>
        </div>
    );
};

export default HeaderOvonovo;
