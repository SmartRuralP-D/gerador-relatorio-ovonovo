const getAssetIds = (firebaseRootStructure) => {
    // Extraindo asset_ids
    const assetsOvonovo = [];
    const assetsOasis = [];

    Object.values(firebaseRootStructure.propriedades).forEach(propriedade => {
        const tipo = propriedade.nome;

        Object.keys(propriedade.unidadesProdutivas).forEach(assetId => {
            if (tipo === 'ovonovo') {
                assetsOvonovo.push(assetId);
            } else if (tipo === 'oasis') {
                assetsOasis.push(assetId);
            }
        });
    });

    return [assetsOvonovo, assetsOasis];
}
export default getAssetIds;