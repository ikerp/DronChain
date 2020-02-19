pragma solidity ^0.5.0;

import "./Droken.sol";
import "./DronesERC721.sol";
import "./ParcelasERC721.sol";
import "./Empresas.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract DronChain is Ownable {
    Droken drokenContract;
    DronesERC721 dronesContract;
    ParcelasERC721 parcelasContract;
    Empresas empresasContract;

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

    function getDrokenContract() public view returns (Droken) {
        return drokenContract;
    }

    function getDronesContract() public view returns (DronesERC721) {
        return dronesContract;
    }

    function getParcelasContract() public view returns (ParcelasERC721) {
        return parcelasContract;
    }

    function getEmpresasContract() public view returns (Empresas) {
        return empresasContract;
    }

    function registrarDron(
        //address empresa,
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

    function getDron(uint256 dronId)
        public
        view
        returns (
            uint256 id,
            address empresa,
            uint256 alturaVueloMinima,
            uint256 alturaVueloMaxima,
            uint256[] memory pesticidas,
            uint256 coste
        )
    {
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
        //address empresa,
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
        //address cuenta,
        string memory nombre,
        string memory cif
    ) public {
        empresasContract.registrarEmpresa(msg.sender, nombre, cif);
    }

    function contratarDron(uint256 dronId, uint256 parcelaId) public {
        require(
            !dronesContratados[dronId][parcelaId],
            "El dron seleccionado ya había sido contratado para fumigar dicha parcela"
        );
        (, address empresaParcela, , , ) = parcelasContract.getParcela(
            parcelaId
        );
        require(
            empresaParcela == msg.sender,
            "El usuario no es el dueño de la parcela"
        );
        (, address empresaDron, , , , uint256 coste) = dronesContract.getDron(
            dronId
        );

        // registramos la contratacion del dron para fumigar esa parcela
        dronesContratados[dronId][parcelaId] = true;

        // el dueño de la parcela autoriza a la empresa del dron a gastar una cantidad de droken igual al coste del dron
        drokenContract.approve(empresaDron, coste);

        // emitimos el evento DronContratado(uint256 dronId, uint256 parcelaId)
        emit DronContratado(dronId, parcelaId);
    }

    function asignarDron(uint256 dronId, uint256 parcelaId) public {
        require(
            dronesContratados[dronId][parcelaId],
            "El dron seleccionado no había sido contratado para fumigar dicha parcela"
        );

        // actualizamos la contratacion del dron para fumigar dicha parcela
        dronesContratados[dronId][parcelaId] = false;

        // hacemos la transferencia de droken del dueño de la parcela a la empresa que gestiona el dron
        (, address empresaParcela, , , ) = parcelasContract.getParcela(
            parcelaId
        );
        (, address empresaDron, , , , uint256 coste) = dronesContract.getDron(
            dronId
        );
        drokenContract.transferFrom(empresaParcela, empresaDron, coste);

        // emitimos el evento ParcelaFumigada(uint256 parcelaId, uint256 dronId)
        emit ParcelaFumigada(parcelaId, dronId);
    }

    /**
     * @dev Se lanza si es llamado por cualquier cuenta de empresa que no exista
     */
    modifier empresaValida(address _cuenta) {
        require(empresasContract.isEmpresa(_cuenta), "La empresa no existe");
        _;
    }
}
