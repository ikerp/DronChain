const DronesERC721 = artifacts.require('DronesERC721')

contract('DronERC721 Tests', (accounts) => {

    let dronesERC721

    const alturasVuelo = [100, 200]
    const pesticidas = [1, 3, 5]
    const coste = 3000

    beforeEach(async () => {
        dronesERC721 = await DronesERC721.new()
    })

    it('Contrato se inicia correctamente', async () => {
        const result = await dronesERC721.numeroDrones.call()
        assert.equal(result, 0, 'El contador de drones no se inicia correctamente')
    })

    it('Registrar un nuevo dron', async () => {
        await dronesERC721.mint(alturasVuelo, pesticidas, coste, { from: accounts[0] })
        const result = await dronesERC721.getDron.call(1)
        const numeroDrones = await dronesERC721.numeroDrones.call()

        assert.equal(numeroDrones, 1, 'El valor del contador de drones no es correcto')
        assert.equal(Number(result[0]), 1, 'El id registrado no es correcto')
        assert.equal(result[1], accounts[0], 'La empresa registrada no es correcta')
        assert.equal(Number(result[2][0]), alturasVuelo[0], 'Las alturas registradas no son correctas')
        assert.equal(Number(result[2][1]), alturasVuelo[1], 'Las alturas registradas no son correctas')
        assert.equal(Number(result[3][0]), pesticidas[0], 'Los pesticidas registrados no son correctos')
        assert.equal(Number(result[3][1]), pesticidas[1], 'Los pesticidas registrados no son correctos')
        assert.equal(Number(result[3][2]), pesticidas[2], 'Los pesticidas registrados no son correctos')
        assert.equal(Number(result[4]), coste, 'El coste registrado no es correcto')
    })

    it('Drones no registrados no son accesibles', async () => {       
        await dronesERC721.mint(alturasVuelo, pesticidas, coste, { from: accounts[0] })
        try {
            await dronesERC721.getDron.call(2)
        } catch (e) {
            assert.equal(e.message, 'Returned error: VM Exception while processing transaction: revert El dron solicitado no existe.',
            'El error de acceso a un dron no existente no es correcto')
        }
    })
})