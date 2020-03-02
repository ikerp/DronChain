pragma solidity ^0.5.0;

import "./Droken.sol";
import "./DronesERC721.sol";
import "./ParcelasERC721.sol";
import "./Empresas.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract DronChain is Ownable {
    Droken private drokenContract;
    DronesERC721 private dronesContract;
    ParcelasERC721 private parcelasContract;
    Empresas private empresasContract;

    mapping(uint256 => mapping(uint256 => bool)) private dronesContratados;

    event DronContratado(uint256 dronId, uint256 parcelaId);
    event ParcelaFumigada(uint256 parcelaId, uint256 dronId);

    /**@dev Crea un nuevo contrato DronChain
     * @param drokens Cuenta del contrato Droken asociado.
     * @param drones Cuenta del contrato DronesERC721 asociado.
     * @param parcelas Cuenta del contrato ParcelasERC721 asociado.
     * @param empresas Cuenta del contrato Empresas asociado.
     */
    constructor(
        address drokens,
        address drones,
        address parcelas,
        address empresas
    ) public {
        drokenContract = Droken(drokens);
        dronesContract = DronesERC721(drones);
        parcelasContract = ParcelasERC721(parcelas);
        empresasContract = Empresas(empresas);
    }

    /**
     * @dev Se lanza si el dron no esta registrado
     */
    modifier dronValido(uint256 dronId) {
        require(dronesContract.isDron(dronId), "El dron no existe");
        _;
    }

    /**
     * @dev Se lanza si la parcela no esta registrada
     */
    modifier parcelaValida(uint256 parcelaId) {
        require(parcelasContract.isParcela(parcelaId), "La parcela no existe");
        _;
    }

    /**
     * @dev Se lanza si la empresa no esta registrada
     */
    modifier empresaValida(address empresa) {
        require(empresasContract.isEmpresa(empresa), "La empresa no existe");
        _;
    }

    /**@dev Devuelve la cuenta del contrato Droken asociado.
     * @return Cuenta del contrato Droken asociado.
     */
    function getDrokenContract() public view returns (address) {
        return address(drokenContract);
    }

    /**@dev Devuelve la cuenta del contrato DronesERC721 asociado.
     * @return Cuenta del contrato DronesERC721 asociado.
     */
    function getDronesContract() public view returns (address) {
        return address(dronesContract);
    }

    /**@dev Devuelve la cuenta del contrato ParcelasERC721 asociado.
     * @return Cuenta del contrato ParcelasERC721 asociado.
     */
    function getParcelasContract() public view returns (address) {
        return address(parcelasContract);
    }

    /**@dev Devuelve la cuenta del contrato Empresas asociado.
     * @return Cuenta del contrato Empresas asociado.
     */
    function getEmpresasContract() public view returns (address) {
        return address(empresasContract);
    }

    /**@dev Registra una nuevo dron.
     * @param alturaVueloMinima Altura de vuelo minima del dron.
     * @param alturaVueloMaxima Altura de vuelo maxima del dron.
     * @param pesticidas Pesticidas que maneja el dron.
     * @param coste Coste de contratacion del dron.
     */
    function registrarDron(
        uint256 alturaVueloMinima,
        uint256 alturaVueloMaxima,
        uint256[] memory pesticidas,
        uint256 coste
    ) public onlyOwner {
        dronesContract.mint(
            msg.sender,
            alturaVueloMinima,
            alturaVueloMaxima,
            pesticidas,
            coste
        );
    }

    /**@dev Devuelve los datos del registro de un dron.
     * @param dronId Identificador del dron.
     * @return id Identificador del dron.
     * @return empresa Cuenta de la empresa propietaria del dron.
     * @return alturaVueloMinima Altura de vuelo minima del dron.
     * @return alturaVueloMaxima Altura de vuelo maxima del dron.
     * @return pesticidas Pesticidas que maneja el dron.
     * @return coste Coste de contratacion del dron.
     */
    function getDron(uint256 dronId) public view returns (
            uint256 id,
            address empresa,
            uint256 alturaVueloMinima,
            uint256 alturaVueloMaxima,
            uint256[] memory pesticidas,
            uint256 coste
        ) {
        (
            id,
            empresa,
            alturaVueloMinima,
            alturaVueloMaxima,
            pesticidas,
            coste
        ) = dronesContract.getDron(dronId);
    }

    /**@dev Registra una nueva parcela.
     * @param alturaVueloMinima Altura de vuelo minima de la parcela.
     * @param alturaVueloMaxima Altura de vuelo maxima de la parcela.
     * @param pesticida Pesticida requerido por la parcela.
     */
    function registrarParcela(
        uint256 alturaVueloMinima,
        uint256 alturaVueloMaxima,
        uint256 pesticida
    ) public empresaValida(msg.sender) {
        parcelasContract.mint(
            msg.sender,
            alturaVueloMinima,
            alturaVueloMaxima,
            pesticida
        );
    }

    /**@dev Registra una nueva empresa.
     * @param nombre Nombre de la empresa.
     * @param cif CIF de la empresa.
     * @param cantidadTokens Cantidad de tokens iniciales a transferir a la empresa.
     */
    function registrarEmpresa(
        string memory nombre,
        string memory cif,
        uint256 cantidadTokens
    ) public {
        empresasContract.registrarEmpresa(msg.sender, nombre, cif);
        drokenContract.transferFrom(owner(), msg.sender, cantidadTokens);
    }

    /**@dev Devuelve los datos del registro de la empresa.
     * @param _cuenta Cuenta de la empresa.
     * @return nombre Nombre de laempresa.
     * @return cif CIF de la empresa.
     */
    function getDatosEmpresa(address _cuenta) public view
        returns (string memory nombre, string memory cif) {
        (nombre, cif) = empresasContract.getDatosEmpresa(_cuenta);
    }

    /**@dev Devuelve si la empresa esta registrada.
     * @param _cuenta Cuenta de la empresa.
     * @return Booleano indicando si la empresa esta registrada.
     */
    function isEmpresa(address _cuenta) public view returns (bool) {
        return empresasContract.isEmpresa(_cuenta);
    }

    /**@dev Devuelve el saldo en drokens de una cuenta.
     * @param _cuenta Cuenta cuyo saldo sa va a consultar.
     * @return Cantidad de drokens en poder de esa cuenta.
     */
    function getDrokens(address _cuenta) public view returns (uint256) {
        return drokenContract.balanceOf(_cuenta);
    }

    /**@dev Contrata un dron para fumigar una parcela.
     * @param dronId Identificador del dron.
     * @param parcelaId Identificador de la parcela.
     */
    function contratarDron(uint256 dronId, uint256 parcelaId)
        public
        empresaValida(msg.sender)
        dronValido(dronId)
        parcelaValida(parcelaId)
    {
        require(
            !dronesContratados[dronId][parcelaId],
            "El dron seleccionado ya había sido contratado para fumigar dicha parcela"
        );
        (, address empresaParcela, , , ) = parcelasContract.getParcela(parcelaId);
        require(empresaParcela == msg.sender,"El usuario no es el dueño de la parcela");

        dronesContratados[dronId][parcelaId] = true;

        emit DronContratado(dronId, parcelaId);
    }

    /**@dev Asigna un dron a la fumigacion de una parcela para la que estaba contratado.
     * @param dronId Identificador del dron.
     * @param parcelaId Identificador de la parcela.
     */
    function asignarDron(uint256 dronId, uint256 parcelaId)
        public
        onlyOwner
        dronValido(dronId)
        parcelaValida(parcelaId)
    {
        require(
            dronesContratados[dronId][parcelaId],
            "El dron seleccionado no había sido contratado para fumigar dicha parcela"
        );

        dronesContratados[dronId][parcelaId] = false;

        (, address empresaParcela, , , ) = parcelasContract.getParcela(parcelaId);
        (, address empresaDron, , , , uint256 coste) = dronesContract.getDron(dronId);
        drokenContract.transferFrom(empresaParcela, empresaDron, coste);

        emit ParcelaFumigada(parcelaId, dronId);
    }

    /**@dev Agrega drokens a la cuenta solicitante.
     * @param cantidadTokens Cantidad de drokens a transferir al socilitante.
     */
    function agregarDrokens(uint256 cantidadTokens) public empresaValida(msg.sender) {
        drokenContract.transferFrom(owner(), msg.sender, cantidadTokens);
    }

    /**@dev Acuña drokens.
     * @param cantidadTokens Cantidad de drokens a acuñar.
     */
    function mintDrokens(uint256 cantidadTokens) public onlyOwner {
        drokenContract.mint(cantidadTokens, owner());
    }
}
