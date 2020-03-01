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

    modifier dronValido(uint256 dronId) {
        require(dronesContract.isDron(dronId), "El dron no existe");
        _;
    }

    modifier parcelaValida(uint256 parcelaId) {
        require(parcelasContract.isParcela(parcelaId), "La parcela no existe");
        _;
    }

    modifier empresaValida(address empresa) {
        require(empresasContract.isEmpresa(empresa), "La empresa no existe");
        _;
    }

    function getDrokenContract() public view returns (address) {
        return address(drokenContract);
    }

    function getDronesContract() public view returns (address) {
        return address(dronesContract);
    }

    function getParcelasContract() public view returns (address) {
        return address(parcelasContract);
    }

    function getEmpresasContract() public view returns (address) {
        return address(empresasContract);
    }


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

    function registrarEmpresa(
        string memory nombre,
        string memory cif,
        uint256 cantidadTokens
    ) public {
        empresasContract.registrarEmpresa(msg.sender, nombre, cif);
        drokenContract.transferFrom(owner(), msg.sender, cantidadTokens);
    }

    function getDatosEmpresa(address _cuenta) public view
        returns (string memory nombre, string memory cif) {
        (nombre, cif) = empresasContract.getDatosEmpresa(_cuenta);
    }

    function isEmpresa(address _cuenta) public view returns (bool) {
        return empresasContract.isEmpresa(_cuenta);
    }

    function getDrokens(address _cuenta) public view returns (uint256) {
        return drokenContract.balanceOf(_cuenta);
    }

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

    function agregarDrokens(uint256 cantidadTokens) public empresaValida(msg.sender) {
        drokenContract.transferFrom(owner(), msg.sender, cantidadTokens);
    }

    function mintDrokens(uint256 cantidadTokens) public onlyOwner {
        drokenContract.mint(cantidadTokens, owner());
    }
}
