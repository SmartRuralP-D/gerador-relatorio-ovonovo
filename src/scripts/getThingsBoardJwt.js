const getThingsBoardJwt = async (firebaseRootStructure) => {
    // Token JWT de autenticação do Thingsboard
    const corpo = {
        username: firebaseRootStructure.thingsboardCredentials.username,
        password: firebaseRootStructure.thingsboardCredentials.password
    };

    const authResponse = await fetch('https://thingsboard.cloud/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
    });

    const authResult = await authResponse.json();
    const token = authResult.token;

    return token;
}
export default getThingsBoardJwt;