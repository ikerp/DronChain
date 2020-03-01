const DronesERC721 = artifacts.require('DronesERC721')
const truffleAssert = require("truffle-assertions");

contract('DronERC721 Tests', (accounts) => {

    let dronesERC721

    const _testOwner = accounts[0]
    const _testAccount1 = accounts[1]
    const _alturaVueloMinima = 100
    const _alturaVueloMaxima = 200
    const _pesticidas = [1, 3, 5]
    const _coste = 3000

    const address0 = "0x0000000000000000000000000000000000000000";

    const registrarDron = async (sender) => {
        let dronId

        const tx = await dronesERC721.mint(
            _testOwner,
            _alturaVueloMinima,
            _alturaVueloMaxima,
            _pesticidas,
            _coste,
            { from: sender }
        )

        truffleAssert.eventEmitted(tx, "DronRegistrado", ev => {
            dronId = ev.id
            const pesticidasCorrectos = ev.pesticidas.every((pesticida, i) => {
                return Number(pesticida) === _pesticidas[i]
            })
            return ev.empresa == _testOwner
                && ev.alturaVueloMinima == _alturaVueloMinima
                && ev.alturaVueloMaxima == _alturaVueloMaxima
                && pesticidasCorrectos
                && ev.coste == _coste
        });

        return dronId
    }

    beforeEach(async () => {
        dronesERC721 = await DronesERC721.new()
    })

    it('Contrato se inicia correctamente', async () => {
        const result = await dronesERC721.numeroDrones()
        assert.equal(
            result,
            0,
            'El contador de drones no se inicia correctamente'
        )
    })

    it('Registrar un nuevo dron', async () => {
        const balanceIni = await dronesERC721.balanceOf(_testOwner)

        const dronId = await registrarDron(_testOwner)

        const balance = await dronesERC721.balanceOf(_testOwner)
        const owner = await dronesERC721.ownerOf(dronId)

        assert.equal(balanceIni, 0, 'El balance inicial no es correcto')
        assert.equal(balance, 1, 'El balance tras el registro no es correcto')
        assert.equal(
            owner,
            _testOwner,
            'El owner del dron registrado no es correcto'
        )
    })

    it("No se puede registrar un dron desde otra cuenta que no sea el propietario", async () => {
        let error
        try {
            await registrarDron(_testAccount1);
        } catch (e) {
            error = e.reason
        }
        assert.equal(
            error,
            "Ownable: caller is not the owner",
            "El error devuelto no es correcto"
        )
    })

    it("Recuperar la información del dron registrado", async () => {
        const dronId = await registrarDron(_testOwner)

        const {
            id,
            empresa,
            alturaVueloMinima,
            alturaVueloMaxima,
            pesticidas,
            coste
        } = await dronesERC721.getDron(dronId)

        assert.equal(
            Number(id),
            Number(dronId),
            'El id registrado no es correcto'
        )
        assert.equal(
            empresa,
            _testOwner,
            'La empresa registrada no es correcta'
        )
        assert.equal(
            alturaVueloMinima,
            _alturaVueloMinima,
            'Las altura de vuelo mínima registrada no es correcta'
        )
        assert.equal(
            alturaVueloMaxima,
            _alturaVueloMaxima,
            'Las altura de vuelo mínima registrada no es correcta'
        )
        _pesticidas.forEach((pesticida, i) => {
            assert.equal(
                pesticidas[i],
                _pesticidas[i],
                'Los pesticidas registrados no son correctos'
            )
        })
        assert.equal(coste, _coste, 'El coste registrado no es correcto')
    })

    it('No se puede recuperar la información de un dron que no existe', async () => {
        let error
        
        const dronId = await registrarDron(_testOwner)
        const dronIdErroneo = dronId + 1

        try {
            await dronesERC721.getDron(dronIdErroneo)
        } catch (e) {
            error = e.message
        }

        assert.equal(
            error,
            'Returned error: VM Exception while processing transaction: revert El dron solicitado no existe.',
            'El error devuelto no es correcto'
        )
    })

    it('Comprobar si un dron existe', async () => {
        const dronId = await registrarDron(_testOwner)
        const dronExiste = await dronesERC721.isDron(dronId)

        assert.ok(dronExiste, 'La comprobación no es correcta')
    })

    it('Obtener el número de drones registrados', async () => {
        const numeroDronesIni = await dronesERC721.numeroDrones()
    
        await registrarDron(_testOwner)

        const numeroDrones = await dronesERC721.numeroDrones()

        assert.equal(
            Number(numeroDrones),
            Number(numeroDronesIni) + 1,
            "El numero de drones obtenido no es correcto"
        )
    })

    it('Transferir un dron', async () => {
        const saldoIni = await dronesERC721.balanceOf(_testAccount1)

        const dronId = await registrarDron(_testOwner)
        const tx = await dronesERC721.transferirDron(
            dronId,
            _testAccount1,
            { from: _testOwner }
        )

        const result = await dronesERC721.getDron(dronId)
        const saldo = await dronesERC721.balanceOf(_testAccount1)
        const owner = await dronesERC721.ownerOf(dronId)

        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            return ev.from == _testOwner
                && ev.to == _testAccount1
                && Number(ev.tokenId) == Number(dronId)
        });

        assert.equal(
            Number(saldo),
            Number(saldoIni) + 1,
            'El balance tras la transferencia no es correcto'
        )
        assert.equal(
            result.empresa,
            _testAccount1,
            'La empresa que figura en el registro del dron no es correcta'
        )
        assert.equal(
            owner,
            _testAccount1,
            'El owner del dron transferido no es correcto'
        )
    })

    it('Solo el propietario puede ordenar la transferencia del dron', async () => {
        let error

        const dronId = await registrarDron(_testOwner)

        try {
            await dronesERC721.transferirDron(
                dronId,
                _testAccount1,
                { from: _testAccount1 }
            )
            console.log('no da error')
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'Ownable: caller is not the owner',
            'El error devuelto no es correcto'
        )
        
    })

    it('Solo se puede transferir un dron existente', async () => {
        let error

        const dronId = await registrarDron(_testOwner)
        const dronIdErroneo = dronId + 1

        try {
            await dronesERC721.transferirDron(
                dronIdErroneo,
                _testAccount1,
                { from: _testOwner }
            )
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'El dron solicitado no existe.',
            'El error devuelto no es correcto'
        )
    })

    it('Solo se puede transferir un dron a una dirección válida', async () => {
        let error

        const dronId = await registrarDron(_testOwner)

        try {
            await dronesERC721.transferirDron(
                dronId,
                address0,
                { from: _testOwner }
            )
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'La address del destinatario no es valida',
            'El error devuelto no es correcto'
        )
    })

    it('Eliminar un dron', async () => {
        const dronId = await registrarDron(_testOwner)

        await dronesERC721.burn(dronId)

        const dronExiste = await dronesERC721.isDron(dronId)

        assert.ok(!dronExiste, 'El dron no ha sido eliminado')
    })

    it('No se puede eliminar un dron que no existe', async () => {
        let error

        const dronId = await registrarDron(_testOwner)

        try {
            const dronIdErroneo = dronId + 1
            await dronesERC721.burn(dronIdErroneo)
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'El dron solicitado no existe.',
            'El error devuelto no es correcto'
        )
    })
})