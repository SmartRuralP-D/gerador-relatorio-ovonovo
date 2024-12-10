import iconePeixeBranco from '../assets/imagens/smartrural_logo_named_white_peixe.svg';
import logoOasis from '../assets/imagens/imagem_Oasis.png';
import '../assets/styles/Header.css';

const HeaderOasis = () => {
    return(
        <div className='horizontal-card-oasis'>
            <img src={iconePeixeBranco} style={{height: '130px'}} alt='icone peixe branco'/>
            <h1 className='titulo'>Oasis</h1>
            <img src={logoOasis} style={{ width: '180px', height: '70px' }} alt='logo Oasis'/>
        </div>
    );
}

export default HeaderOasis;