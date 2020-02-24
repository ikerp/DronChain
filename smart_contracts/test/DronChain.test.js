const DronChain = artifacts.require("DronChain");
const Droken = artifacts.require("Droken");
const DronesERC721 = artifacts.require("DronesERC721");
const ParcelasERC721 = artifacts.require("ParcelasERC721");
const Empresas = artifacts.require("Empresas");
const truffleAssert = require("truffle-assertions");

contract("DronChain Tests", accounts => {
  let dronChain, droken, dronesERC721, empresas, parcelasERC721;
  let dronId;

  const empresaDrones = accounts[0];
  const empresa1 = accounts[1];
  const empresa2 = accounts[2];

  const cantidadDrokenIni = 5000;
  const drokensIniEmpresa = 50;

  const nombreEmpresa1 = "Empresa 1";
  const cifEmpresa1 = "B26111111";
  const nombreEmpresa2 = "Empresa 2";
  const cifEmpresa2 = "B26111112";

  const _alturaVueloMinima1 = 50;
  const _alturaVueloMinima2 = 100;
  const _alturaVueloMaxima1 = 200;
  const _alturaVueloMaxima2 = 250;
  const _pesticidas1 = [1, 3, 5];
  const _pesticidas2 = [2, 3, 4];
  const _coste1 = 3;
  const _coste2 = 2;
  const address0 = "0x0000000000000000000000000000000000000000";

  const registrarDron = async (alturaVueloMinima, alturaVueloMaxima, pesticidas, coste) => {
    let dronId;
    const tx = await dronChain.registrarDron(
      alturaVueloMinima,
      alturaVueloMaxima,
      pesticidas,
      coste,
      { from: empresaDrones }
    );

    // event DronRegistrado(uint256 indexed id, address indexed empresa, uint256 alturaVueloMinima, uint256 alturaVueloMaxima, uint256[] pesticidas, uint256 coste)
    const event = tx.receipt.rawLogs.some(log => {
      if (log.topics[0] == web3.utils.keccak256("DronRegistrado(uint256,address,uint256,uint256,uint256[],uint256)")) {
        let { id } = web3.eth.abi.decodeLog(
          [{
            type: "uint256",
            name: "id",
            indexed: true
          }],
          log.topics[0],[log.topics[1]]);

        dronId = id;
        return true;
      }
    });
    assert.ok(event, "El dron no se ha registrado correctamente: el evento DronRegistrado no se ha emitido");

    return dronId;
  }

  const registrarParcela = async (empresa, alturaVueloMinima, alturaVueloMaxima, pesticida) => {
    let parcelaId;
    const tx = await dronChain.registrarParcela(
      alturaVueloMinima,
      alturaVueloMaxima,
      pesticida,
      { from: empresa }
    );

    // event ParcelaRegistrada(uint256 indexed id, address indexed empresa, uint256 alturaVueloMinima, uint256 alturaVueloMaxima, uint256 pesticida)
    const event = tx.receipt.rawLogs.some(log => {
      if (log.topics[0] == web3.utils.keccak256("ParcelaRegistrada(uint256,address,uint256,uint256,uint256)")) {
        let { id } = web3.eth.abi.decodeLog(
          [{
            type: "uint256",
            name: "id",
            indexed: true
          }],
          log.topics[0],[log.topics[1]]);

        parcelaId = id;
        return true;
      }
    });
    assert.ok(event, "La parcela no se ha registrado correctamente: el evento ParcelaRegistrada no se ha emitido");

    return parcelaId;
  }

  beforeEach(async () => {
    droken = await Droken.new(5000, { from: empresaDrones });
    dronesERC721 = await DronesERC721.new({ from: empresaDrones });
    parcelasERC721 = await ParcelasERC721.new({ from: empresaDrones });
    empresas = await Empresas.new({ from: empresaDrones });
  
    dronChain = await DronChain.new(
      droken.address,
      dronesERC721.address,
      parcelasERC721.address,
      empresas.address,
      { from: empresaDrones }
      );

    await droken.transferOwnership(dronChain.address, { from: empresaDrones });
    await dronesERC721.transferOwnership(dronChain.address, { from: empresaDrones });
    await parcelasERC721.transferOwnership(dronChain.address, { from: empresaDrones });
    await empresas.transferOwnership(dronChain.address, { from: empresaDrones });

    await droken.approve(dronChain.address, cantidadDrokenIni, { from: empresaDrones });
  });

  it("Los propietarios de los contratos se inician correctamente", async () => {
    const dronChainOwner = await dronChain.owner();
    const drokenOwner = await droken.owner();
    const dronesERC721Owner = await dronesERC721.owner();
    const parcelasERC721Owner = await parcelasERC721.owner();
    const empresasOwner = await empresas.owner();


    assert.equal(dronChainOwner, empresaDrones, "El contrato DronChain no se inicia correctamente");
    assert.equal(drokenOwner, dronChain.address, "El contrato Droken no se inicia correctamente");
    assert.equal(dronesERC721Owner, dronChain.address, "El contrato DronesERC721 no se inicia correctamente");
    assert.equal(parcelasERC721Owner, dronChain.address, "El contrato ParcelasERC721 no se inicia correctamente");
    assert.equal(empresasOwner, dronChain.address, "El contrato Empresas no se inicia correctamente");
  });

  it("Las direcciones de los contratos asociados se devuelven correctamente", async () => {
    const drokenAddress = await dronChain.getDrokenContract();
    const dronesAddress = await dronChain.getDronesContract();
    const parcelasAddress = await dronChain.getParcelasContract();
    const empresasAddress = await dronChain.getEmpresasContract();

    assert.equal(drokenAddress, droken.address, "La dirección del contrato Droken no se devuelve correctamente");
    assert.equal(dronesAddress, dronesERC721.address, "La dirección del contrato DronesERC721 no se devuelve correctamente");
    assert.equal(parcelasAddress, parcelasERC721.address, "La dirección del contrato parcelasERC721 no se devuelve correctamente");
    assert.equal(empresasAddress, empresas.address, "La dirección del contrato empresas no se devuelve correctamente");
  })

  it("Registrar un nuevo dron", async () => {
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);    

    const { id, empresa, alturaVueloMinima, alturaVueloMaxima, pesticidas, coste } = await dronChain.getDron(Number(dronId));

    assert.equal(Number(id),Number(dronId), "El valor del identificador del dron no es correcto");
    assert.equal(empresa, empresaDrones, "La cuenta de la empresa no se recupera correctamente");
    assert.equal(Number(alturaVueloMinima), _alturaVueloMinima1, "La altura de vuelo mínima no se recupera correctamente");
    assert.equal(Number(alturaVueloMaxima), _alturaVueloMaxima1, "La altura de vuelo máxima no se recupera correctamente");
    _pesticidas1.forEach((pest, i) => {
      assert.equal(pesticidas[i], _pesticidas1[i], "Los pesticidas registrados no son correctos");
    });
    assert.equal(Number(coste), _coste1, "El coste no se recupera correctamente");
  });

  it("Los balances de drokens iniciales son correctos", async () => {
    const balanceEmpresaDrones = await dronChain.getDrokens(empresaDrones);
    const balanceEmpresa1 = await dronChain.getDrokens(empresa1);

    assert.equal(balanceEmpresaDrones, cantidadDrokenIni, "El balance inicial de la empresa propietaria de los drones no es correcto");
    assert.equal(balanceEmpresa1, 0, "El balance inicial de las empresas dueñas de parcelas no es correcto");
  })

  it("Registrar una nueva empresa", async () => {
    const tx = await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });

    // event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);
    const event = tx.receipt.rawLogs.some(log => {
      return log.topics[0] == web3.utils.keccak256("EmpresaRegistrada(address,string,string)");
    });
    const balanceEmpresaDrones = await dronChain.getDrokens(empresaDrones);
    const balanceEmpresa1 = await dronChain.getDrokens(empresa1);

    assert.ok(event, "La empresa no se ha registrado correctamente - Evento EmpresaRegistrada no emitido");
    assert.equal(balanceEmpresaDrones, cantidadDrokenIni - drokensIniEmpresa, "El balance de la empresa propietaria de los drones no es correcto");
    assert.equal(balanceEmpresa1, drokensIniEmpresa, "El balance de la empresa propietaria de la parcela no es correcto");   
  });

  it("Registrar una nueva parcela", async () => {
    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);
  });

  it("Solo las empresas registradas pueden registrar una parcela", async () => {
    var error;
    try {
      await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);
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

  it("Contratar dron", async () => {
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);

    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    const parcelaId = await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);

    await droken.increaseAllowance(dronChain.address, _coste1, { from: empresa1 });
    const txContratacion = await dronChain.contratarDron(dronId, parcelaId, { from: empresa1 });

    // allowance(address owner, address spender)
    const allowanceDronChain = await droken.allowance(empresa1, dronChain.address);

    // event DronContratado(uint256 dronId, uint256 parcelaId)
    truffleAssert.eventEmitted(txContratacion, "DronContratado", ev => {
      return ev.dronId == dronId && ev.parcelaId == parcelaId;
    });
    assert.equal(Number(allowanceDronChain), _coste1, "El allowance de la empresa dueña de la parcela a DronChain no es correcto")
  }); 

  it("No se puede contratar un dron para fumigar una parcela para la que ya había sido contratado y aún no ha fumigado", async () => {
    let error;
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);

    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    const parcelaId = await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);

    await droken.increaseAllowance(dronChain.address, _coste1, { from: empresa1 });
    await dronChain.contratarDron(dronId, parcelaId, { from: empresa1 });

    try {
      await droken.increaseAllowance(dronChain.address, _coste1, { from: empresa1 });
      await dronChain.contratarDron(dronId, parcelaId, { from: empresa1 });
    } catch (e) {
      error = e.reason;
    }
    assert.equal(error, "El dron seleccionado ya había sido contratado para fumigar dicha parcela", "El error devuelto no es correcto");
  });

  it("No se puede contratar un dron para fumigar una parcela por alguien que no sea el dueño de la parcela", async () => {
    let error;
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);

    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    const parcelaId = await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);

    await dronChain.registrarEmpresa(nombreEmpresa2, cifEmpresa2, drokensIniEmpresa, { from: empresa2 });

    try {
      await droken.increaseAllowance(dronChain.address, _coste1, { from: empresa2 });
      await dronChain.contratarDron(dronId, parcelaId, { from: empresa2 });
    } catch (e) {
      error = e.reason;
    }
    assert.equal(error, "El usuario no es el dueño de la parcela", "El error devuelto no es correcto");
  });

  it("Asignar un dron a la fumigación de una parcela", async () => {
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);

    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    const parcelaId = await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);

    await droken.increaseAllowance(dronChain.address, _coste1, { from: empresa1 });
    await dronChain.contratarDron(dronId, parcelaId, { from: empresa1 });

    const balanceIniEmpresaDrones = await dronChain.getDrokens(empresaDrones);
    const balanceIniEmpresa1 = await dronChain.getDrokens(empresa1);

    const tx = await dronChain.asignarDron(dronId, parcelaId, { from: empresaDrones });

    const balanceEmpresaDrones = await dronChain.getDrokens(empresaDrones);
    const balanceEmpresa1 = await dronChain.getDrokens(empresa1);

    // event ParcelaFumigada(uint256 parcelaId, uint256 dronId)
    truffleAssert.eventEmitted(tx, "ParcelaFumigada", ev => {
      return ev.dronId == dronId && ev.parcelaId == parcelaId;
    });
    assert.equal(Number(balanceEmpresaDrones), Number(balanceIniEmpresaDrones) + _coste1, "El balance de la empresa propietaria del dron no es correcto");
    assert.equal(Number(balanceEmpresa1), Number(balanceIniEmpresa1) - _coste1, "El balance de la empresa que contrata el dron no es correcto");
  });

  it("No se puede asignar un dron a la fumigación de una parcela para la que no haya sido contratado", async () => {
    let error;
    const dronId = await registrarDron(_alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1, _coste1);

    await dronChain.registrarEmpresa(nombreEmpresa1, cifEmpresa1, drokensIniEmpresa, { from: empresa1 });
    const parcelaId = await registrarParcela(empresa1, _alturaVueloMinima1, _alturaVueloMaxima1, _pesticidas1[1]);

    try {
      await dronChain.asignarDron(dronId, parcelaId, { from: empresaDrones });
    } catch (e) {
      error = e.reason;
    }
    assert.equal(error, "El dron seleccionado no había sido contratado para fumigar dicha parcela", "El error devuelto no es correcto");  
  });

});
