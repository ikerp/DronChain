const DronesERC721 = artifacts.require('DronesERC721')

contract('DronERC721 Tests', (accounts) => {

    let dronesERC721

    const _alturasVuelo = [100, 200]
    const _pesticidas = [1, 3, 5]
    const _coste = 3000

    beforeEach(async () => {
        dronesERC721 = await DronesERC721.new()
    })

    it('Contrato se inicia correctamente', async () => {
        const result = await dronesERC721.numeroDrones.call()
        assert.equal(result, 0, 'El contador de drones no se inicia correctamente')
    })

    it('Registrar un nuevo dron', async () => {
        await dronesERC721.mint(_alturasVuelo, _pesticidas, _coste, { from: accounts[0] })
        const { id, empresa, alturasVuelo, pesticidas, coste } = await dronesERC721.getDron.call(1)
        const numeroDrones = await dronesERC721.numeroDrones.call()

        assert.equal(numeroDrones, 1, 'El valor del contador de drones no es correcto')
        assert.equal(id, 1, 'El id registrado no es correcto')
        assert.equal(empresa, accounts[0], 'La empresa registrada no es correcta')
        _alturasVuelo.forEach((altura, i) => {
            assert.equal(Number(alturasVuelo[i]), _alturasVuelo[i], 'Las alturas registradas no son correctas')
        })
        _pesticidas.forEach((pesticida, i) => {
            assert.equal(Number(pesticidas[i]), _pesticidas[i], 'Los pesticidas registrados no son correctos')
        })
        assert.equal(Number(coste), _coste, 'El coste registrado no es correcto')
    })

    it('Drones no registrados no son accesibles', async () => {       
        await dronesERC721.mint(_alturasVuelo, _pesticidas, _coste, { from: accounts[0] })
        try {
            await dronesERC721.getDron.call(2)
        } catch (e) {
            assert.equal(e.message, 'Returned error: VM Exception while processing transaction: revert El dron solicitado no existe.',
            'El error de acceso a un dron no existente no es correcto')
        }
    })
})