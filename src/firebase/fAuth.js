import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get} from 'firebase/database';
import config from './config.json';

// Carrega as configurações do Firebase do arquivo config.json
const firebaseConfig = config;

// Inicializa o Firebase com as configurações do arquivo
const app = initializeApp(firebaseConfig);
export {app};

// Referência ao Realtime Database
const database = getDatabase(app);

// Função para obter os dados do database
const getDatabaseInfo = async () => {
  const dbRef = ref(database, '/');
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Retorna os dados obtidos do banco de dados Firebase
    } else {
      return 'No data available';
    }
  } catch (error) {
    throw new Error('Erro ao buscar dados do Firebase:', error);
  }
};

// Atribui o objeto a uma variável
const firebaseService = { app, getDatabaseInfo };

// Exporta a variável como o módulo default
export default firebaseService;