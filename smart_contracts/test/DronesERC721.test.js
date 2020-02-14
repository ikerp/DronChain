const DronesERC721 = artifacts.require('DronesERC721')

contract('DronERC721 Tests', (accounts) => {

    let dronesERC721

    const _testOwner = accounts[0]
    const _testAccount1 = accounts[1]
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
        const balanceIni = await dronesERC721.balanceOf.call(_testOwner)
        const numeroDronesIni = await dronesERC721.numeroDrones.call()

        await dronesERC721.mint(_testOwner, _alturasVuelo, _pesticidas, _coste, { from: _testOwner })
        const { id, empresa, alturasVuelo, pesticidas, coste } = await dronesERC721.getDron.call(1)
        const balance = await dronesERC721.balanceOf.call(_testOwner)
        const numeroDrones = await dronesERC721.numeroDrones.call()
        const owner = await dronesERC721.ownerOf.call(id)

        assert.equal(balanceIni, 0, 'El balance inicial no es correcto')
        assert.equal(balance, 1, 'El balance tras el registro no es correcto')
        assert.equal(numeroDronesIni, 0, 'El número de drones inicial no es correcto')
        assert.equal(numeroDrones, 1, 'El número de drones tras el registro no es correcto')
        assert.equal(owner, _testOwner, 'El owner del dron registrado no es correcto')
        assert.equal(id, 1, 'El id registrado no es correcto')
        assert.equal(empresa, _testOwner, 'La empresa registrada no es correcta')
        _alturasVuelo.forEach((alt, i) => {
            assert.equal(alturasVuelo[i], _alturasVuelo[i], 'Las alturas registradas no son correctas')
        })
        _pesticidas.forEach((pest, i) => {
            assert.equal(pesticidas[i], _pesticidas[i], 'Los pesticidas registrados no son correctos')
        })
        assert.equal(coste, _coste, 'El coste registrado no es correcto')
    })

    it('Drones no registrados no son accesibles', async () => {       
        await dronesERC721.mint(_testOwner, _alturasVuelo, _pesticidas, _coste, { from: _testOwner })
        try {
            await dronesERC721.getDron.call(2)
        } catch (e) {
            assert.equal(e.message, 'Returned error: VM Exception while processing transaction: revert El dron solicitado no existe.',
            'El error de acceso a un dron no existente no es correcto')
        }
    })

    it('Transferir un dron', async () => {
        const balanceIni = await dronesERC721.balanceOf.call(_testAccount1)

        await dronesERC721.mint(_testOwner, _alturasVuelo, _pesticidas, _coste, { from: _testOwner })
        await dronesERC721.transferirDron(1, _testAccount1, { from: _testOwner })
        const result = await dronesERC721.getDron.call(1)
        const balance = await dronesERC721.balanceOf.call(_testAccount1)
        const owner = await dronesERC721.ownerOf.call(1)

        assert.equal(balanceIni, 0, 'El balance inicial no es correcto')
        assert.equal(balance, 1, 'El balance tras la transferencia no es correcto')
        assert.equal(result.empresa, _testAccount1, 'La empresa que figura en el registro del dron no es correcta')
        assert.equal(owner, _testAccount1, 'El owner del dron transferido no es correcto')
    })
})