const DronChain = artifacts.require("DronChain");
const truffleAssert = require("truffle-assertions");

contract("DronChain Tests", accounts => {
  let dronChain;
  let dronId;

  const _alturaVueloMinima = 100;
  const _alturaVueloMaxima = 200;
  const _pesticidas = [1, 3, 5];
  const _coste = 3000;
  const address0 = "0x0000000000000000000000000000000000000000";

  beforeEach(async () => {
    dronChain = await DronChain.new({ from: accounts[0] });
  });

  it("Contrato se inicia correctamente", async () => {
    const owner = await dronChain.owner();

    assert.equal(owner, accounts[0], "El contrato no se inicia correctamente");
  });

  it("Registrar un nuevo dron", async () => {
    const tx = await dronChain.registrarDron(
      _alturaVueloMinima,
      _alturaVueloMaxima,
      _pesticidas,
      _coste,
      { from: accounts[0] }
    );

    // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    const event = tx.receipt.rawLogs.some(log => {
      if (
        log.topics[0] ==
        web3.utils.keccak256("Transfer(address,address,uint256)")
      ) {
        let { from, to, tokenId } =
          web3.eth.abi.decodeLog(
            [
              {
                type: "address",
                name: "from",
                indexed: true
              },
              {
                type: "address",
                name: "to",
                indexed: true
              },
              {
                type: "uint256",
                name: "tokenId",
                indexed: true
              }
            ],
            log.topics[0],
            [log.topics[1], log.topics[2], log.topics[3]]
          );

        dronId = tokenId;
        return true;
      }
    });

    assert.ok(
        event,
        "El dron no se ha registrado correctamente - Evento no emitido"
      );    

    const { id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste } = await dronChain.getDron(Number(dronId));

    assert.equal(
      Number(id),
      Number(dronId),
      "El valor del identificador del dron no es correcto"
    );
    assert.equal(
      empresa,
      accounts[0],
      "La cuenta de la empresa no se recupera correctamente"
    );
    assert.equal(
      Number(alturaVueloMinima),
      _alturaVueloMinima,
      "La altura de vuelo mínima no se recupera correctamente"
    );
    assert.equal(
      Number(alturaVueloMaxima),
      _alturaVueloMaxima,
      "La altura de vuelo máxima no se recupera correctamente"
    );
    _pesticidas.forEach((pest, i) => {
      assert.equal(
        pesticidas[i],
        _pesticidas[i],
        "Los pesticidas registrados no son correctos"
      );
    });
    assert.equal(
      Number(coste),
      _coste,
      "El coste no se recupera correctamente"
    );
  });

  /*
    it("Registrada nueva Empresa", async () => {
        const tx = await empresas.registrarEmpresa(
            accounts[1],
            "Empresa 1",
            "B26111111",
            { from: accounts[0] }
        );

        // event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);
        truffleAssert.eventEmitted(tx, "EmpresaRegistrada", ev => {
            return (
                ev._cuenta == accounts[1] &&
                ev._nombre == "Empresa 1" &&
                ev._cif == "B26111111"
            );
        });
    });

    it("Solo el owner puede registrar nuevas Empresas", async () => {
        try {
            await empresas.registrarEmpresa(accounts[2], "Empresa 2", "B26222222", {
                from: accounts[1]
            });
        } catch (err) {
            // Funcionamiento correcto: No deja registrar nuevas Empresas si no es owner
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

    it("Recuperados datos de Empresa que existe", async () => {
        const tx = await empresas.registrarEmpresa(
            accounts[2],
            "Empresa 2",
            "B26222222",
            { from: accounts[0] }
        );
        const { nombre, cif } = await empresas.getDatosEmpresa(accounts[2]);

        // event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);
        truffleAssert.eventEmitted(tx, "EmpresaRegistrada", ev => {
            return (
                ev._cuenta == accounts[2] &&
                ev._nombre == "Empresa 2" &&
                ev._cif == "B26222222"
            );
        });
        assert.equal(
            nombre,
            "Empresa 2",
            "El nombre de la empresa no se recupera correctamente"
        );
        assert.equal(
            cif,
            "B26222222",
            "El CIF de la empresa no se recupera correctamente"
        );
    });

    it("No se recuperan datos de Empresa que no existe", async () => {
        var error;
        try {
            await empresas.getDatosEmpresa(accounts[1]);
        } catch (err) {
            // Este es el funcionamiento correcto
            // No deja recuperar los datos de empresa
            error = err;
        }
        assert.isAbove(
            error.message.search("VM Exception while processing transaction: revert"),
            -1,
            "La empresa no existe"
        );
    });

    it("La cuenta corresponde a una empresa existente", async () => {
        await empresas.registrarEmpresa(
            accounts[3],
            "Empresa 3",
            "B26333333",
            { from: accounts[0] }
        );        
        const existe = await empresas.isEmpresa.call(accounts[3]);

        assert.equal(existe, true, "La existencia de la empresa no se valida correctamente");
    });   */
});
