const ParcelasERC721 = artifacts.require("ParcelasERC721");
const truffleAssert = require("truffle-assertions");

contract("ParcelasERC721 Tests", accounts => {
    let parcelasERC721;

    const _alturaVueloMinima = 100;
    const _alturaVueloMaxima = 200;
    const _pesticida = 1;
    const address0 = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        parcelasERC721 = await ParcelasERC721.new({ from: accounts[0] });
    });

    it("Contrato se inicia correctamente", async () => {
        const result = await parcelasERC721.numeroParcelas.call();
        assert.equal(
            result,
            0,
            "El contador de parcelas no se inicia correctamente"
        );
    });

    it("Registrar una nueva parcela", async () => {
        const tx = await parcelasERC721.mint(
            accounts[1],
            _alturaVueloMinima,
            _alturaVueloMaxima,
            _pesticida,
            { from: accounts[0] }
        );
        const parcela = await parcelasERC721.getParcela.call(1);
        const numeroParcelas = await parcelasERC721.numeroParcelas.call();

        // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            return ev.from == address0 && ev.to == accounts[1] && ev.tokenId == 1;
        });
        assert.equal(
            numeroParcelas,
            1,
            "El valor del contador de parcelas no es correcto"
        );
        assert.equal(Number(parcela.id), 1, "El id registrado no es correcto");
        assert.equal(
            parcela.empresa,
            accounts[1],
            "La empresa registrada no es correcta"
        );
        assert.equal(
            Number(parcela.alturaVueloMinima),
            _alturaVueloMinima,
            "La altura mínima registrada no es correcta"
        );
        assert.equal(
            Number(parcela.alturaVueloMaxima),
            _alturaVueloMaxima,
            "La altura máxima registrada no es correcta"
        );
        assert.equal(
            Number(parcela.pesticida),
            _pesticida,
            "El pesticida registrado no es correcto"
        );
    });

    it("Solo el owner puede registrar nuevas Parcelas", async () => {
        try {
            await parcelasERC721.mint(
                accounts[2],
                _alturaVueloMinima,
                _alturaVueloMaxima,
                _pesticida,
                { from: accounts[1] }
            );
        } catch (err) {
            // Funcionamiento correcto: No deja registrar nuevas Parcelas si no es owner
            error = err;
            assert.isAbove(
                error.message.search(
                "VM Exception while processing transaction: revert"
                ),
                -1,
                "Ownable: caller is not the owner"
            );
        }
    });

    it("Recuperados datos de Parcela que existe", async () => {
        let contador;
        const tx = await parcelasERC721.mint(
            accounts[2],
            _alturaVueloMinima,
            _alturaVueloMaxima,
            _pesticida,
            { from: accounts[0] }
        );

        // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            contador = ev.tokenId;
            return ev.from == address0 && ev.to == accounts[2] && ev.tokenId == 1;
        });
        
        const { id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticida } = await parcelasERC721.getParcela(Number(contador));

        assert.equal(
            id,
            1,
            "El identificador de la parcela no se recupera correctamente"
        );
        assert.equal(
            empresa,
            accounts[2],
            "La cuenta de la empresa no se recupera correctamente"
        );
        assert.equal(
            alturaVueloMinima,
            _alturaVueloMinima,
            "La altura de vuelo mínima no se recupera correctamente"
        );
        assert.equal(
            alturaVueloMaxima,
            _alturaVueloMaxima,
            "La altura de vuelo máxima no se recupera correctamente"
        );
        assert.equal(
            pesticida,
            _pesticida,
            "El pesticida no se recupera correctamente"
        );
    });

    it("No se recuperan datos de Parcela que no existe", async () => {
        var error;
        try {
            await parcelasERC721.getParcela(100);
        } catch (err) {
            // Este es el funcionamiento correcto
            // No deja recuperar los datos de parcela
            error = err;
        }
        assert.isAbove(
            error.message.search("VM Exception while processing transaction: revert"),
            -1,
            "La parcela solicitada no existe"
        );
    });
});
