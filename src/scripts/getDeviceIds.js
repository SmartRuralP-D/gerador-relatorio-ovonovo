const getDeviceIds = (firebaseRootStructure) => {
    //extraindo device ids
    let devicesOvonovo = {};
    let devicesOasis = {};

    Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
        if (propriedade.nome === 'ovonovo') {
            Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
                if (!devicesOvonovo[unidade.nome]){devicesOvonovo[unidade.nome] = {};}
                devicesOvonovo[unidade.nome] = Object.values(unidade.dispositivos);
            });
        } else if (propriedade.nome === 'oasis') {
            Object.values(propriedade.unidadesProdutivas).forEach(unidade => {
                devicesOasis[unidade.nome] = Object.values(unidade.dispositivos);
            });
        }
    });
    
    return {devicesOvonovo, devicesOasis};
}
export default getDeviceIds;