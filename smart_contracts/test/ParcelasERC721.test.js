const ParcelasERC721 = artifacts.require("ParcelasERC721");
const truffleAssert = require("truffle-assertions");

contract("ParcelasERC721 Tests", accounts => {

    let parcelasERC721;

    const _testOwner = accounts[0]
    const _testAccount1 = accounts[1]
    const _alturaVueloMinima = 100;
    const _alturaVueloMaxima = 200;
    const _pesticida = 1;
    const address0 = "0x0000000000000000000000000000000000000000";

    const registrarParcela = async (owner, sender) => {
        let parcelaId

        const tx = await parcelasERC721.mint(
            owner,
            _alturaVueloMinima,
            _alturaVueloMaxima,
            _pesticida,
            { from: sender }
        )

        truffleAssert.eventEmitted(tx, "ParcelaRegistrada", ev => {
            parcelaId = ev.id
            return ev.empresa == owner
                && ev.alturaVueloMinima == _alturaVueloMinima
                && ev.alturaVueloMaxima == _alturaVueloMaxima
                && ev.pesticida == _pesticida
        });

        return parcelaId
    }

    beforeEach(async () => {
        parcelasERC721 = await ParcelasERC721.new({ from: _testOwner });
    });

    it("Contrato se inicia correctamente", async () => {
        const result = await parcelasERC721.numeroParcelas();
        assert.equal(
            result,
            0,
            "El contador de parcelas no se inicia correctamente"
        );
    });

    it('Registrar una nueva parcela', async () => {
        const balanceIni = await parcelasERC721.balanceOf(_testOwner)

        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        const balance = await parcelasERC721.balanceOf(_testOwner)
        const owner = await parcelasERC721.ownerOf(parcelaId)

        assert.equal(balanceIni, 0, 'El balance inicial no es correcto')
        assert.equal(balance, 1, 'El balance tras el registro no es correcto')
        assert.equal(
            owner,
            _testOwner,
            'El owner del dron registrado no es correcto'
        )
    })

    it("No se puede registrar una parcela desde otra cuenta que no sea el propietario", async () => {
        let error
        try {
            await registrarParcela(_testAccount1, _testAccount1);
        } catch (e) {
            error = e.reason
        }
        assert.equal(
            error,
            "Ownable: caller is not the owner",
            "El error devuelto no es correcto"
        )
    })

    it("No se puede registrar una parcela cuyo propietario no sea una address valida", async () => {
        let error
        try {
            await registrarParcela(address0, _testOwner);
        } catch (e) {
            error = e.reason
        }
        assert.equal(
            error,
            "La cuenta no es valida",
            "El error devuelto no es correcto"
        )
    })

    it("Recuperar la información de la parcela registrada", async () => {
        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        const {
            id,
            empresa,
            alturaVueloMinima,
            alturaVueloMaxima,
            pesticida
        } = await parcelasERC721.getParcela(parcelaId)

        assert.equal(
            Number(id),
            Number(parcelaId),
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
        assert.equal(
            pesticida,
            _pesticida,
            'El pesticida registrado no es correcto'
        )
    })

    it('No se puede recuperar la información de una parcela que no existe', async () => {
        let error
        
        const parcelaId = await registrarParcela(_testOwner, _testOwner)
        const parcelaIdErroneo = parcelaId + 1

        try {
            await parcelasERC721.getParcela(parcelaIdErroneo)
        } catch (e) {
            error = e.message
        }

        assert.equal(
            error,
            'Returned error: VM Exception while processing transaction: revert La parcela solicitada no existe',
            'El error devuelto no es correcto'
        )
    })

    it('Comprobar si una parcela existe', async () => {
        const parcelaId = await registrarParcela(_testOwner, _testOwner)
        const parcelaExiste = await parcelasERC721.isParcela(parcelaId)

        assert.ok(parcelaExiste, 'La comprobación no es correcta')
    })

    it('Obtener el número de parcelas registradas', async () => {
        const numeroParcelasIni = await parcelasERC721.numeroParcelas()
    
        await registrarParcela(_testOwner, _testOwner)

        const numeroParcelas = await parcelasERC721.numeroParcelas()

        assert.equal(
            Number(numeroParcelas),
            Number(numeroParcelasIni) + 1,
            "El numero de parcelas obtenido no es correcto"
        )
    })

    it('Transferir una parcela', async () => {
        const saldoIni = await parcelasERC721.balanceOf(_testAccount1)

        const parcelaId = await registrarParcela(_testOwner, _testOwner)
        const tx = await parcelasERC721.transferirParcela(
            parcelaId,
            _testAccount1,
            { from: _testOwner }
        )

        const result = await parcelasERC721.getParcela(parcelaId)
        const saldo = await parcelasERC721.balanceOf(_testAccount1)
        const owner = await parcelasERC721.ownerOf(parcelaId)

        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            return ev.from == _testOwner
                && ev.to == _testAccount1
                && Number(ev.tokenId) == Number(parcelaId)
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

    it('Solo el propietario puede ordenar la transferencia de una parcela', async () => {
        let error

        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        try {
            await parcelasERC721.transferirParcela(
                parcelaId,
                _testAccount1,
                { from: _testAccount1 }
            )
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'Ownable: caller is not the owner',
            'El error devuelto no es correcto'
        )
        
    })

    it('Solo se puede transferir una parcela existente', async () => {
        let error

        const parcelaId = await registrarParcela(_testOwner, _testOwner)
        const parcelaIdErroneo = parcelaId + 1

        try {
            await parcelasERC721.transferirParcela(
                parcelaIdErroneo,
                _testAccount1,
                { from: _testOwner }
            )
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'La parcela solicitada no existe',
            'El error devuelto no es correcto'
        )
    })

    it('Solo se puede transferir una parcela a una dirección válida', async () => {
        let error

        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        try {
            await parcelasERC721.transferirParcela(
                parcelaId,
                address0,
                { from: _testOwner }
            )
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'La cuenta no es valida',
            'El error devuelto no es correcto'
        )
    })

    it('Eliminar una parcela', async () => {
        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        await parcelasERC721.burn(parcelaId)

        const parcelaExiste = await parcelasERC721.isParcela(parcelaId)

        assert.ok(!parcelaExiste, 'La parcela no ha sido eliminada')
    })

    it('No se puede eliminar una parcela que no existe', async () => {
        let error

        const parcelaId = await registrarParcela(_testOwner, _testOwner)

        try {
            const parcelaIdErroneo = parcelaId + 1
            await parcelasERC721.burn(parcelaIdErroneo)
        } catch (e) {
            error = e.reason
        }

        assert.equal(
            error,
            'La parcela solicitada no existe',
            'El error devuelto no es correcto'
        )
    })
});
