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

    event DronContratado(uint256 dronId, uint256 parcelaId);
    event ParcelaFumigada(uint256 parcelaId, uint256 dronId);

    constructor() public {
        //drokenContract = new Droken(5000);
        dronesContract = new DronesERC721();
        //parcelasContract = new ParcelasERC721();
        //empresasContract = new Empresas();
    }

    function getDronesContract() public view returns (DronesERC721) {
        return dronesContract;
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
    /*
    function registrarParcela(
        //address empresa,
        uint256 alturaVueloMinima,
        uint256 alturaVueloMaxima,
        uint256 pesticida
    ) public empresaValida(msg.sender) returns (uint256) {
        return
            parcelasContract.mint(
                msg.sender,
                alturaVueloMinima,
                alturaVueloMaxima,
                pesticida
            );
    }*/
    /*
    function registrarEmpresa(
        //address cuenta,
        string memory nombre,
        string memory cif
    ) public {
        empresasContract.registrarEmpresa(msg.sender, nombre, cif);
    }
*/
    /*
    function contratarDron(uint256 dronId, uint256 parcelaId) public {
        //TODO
    }

    function asignarDron(uint256 dronId, uint256 parcelaId) public {
        //TODO
    }
*/

    /**
     * @dev Se lanza si es llamado por cualquier cuenta de empresa que no exista
     */
    /*    modifier empresaValida(address _cuenta) {
        require(empresasContract.isEmpresa(_cuenta), "La empresa no existe");
        _;
    }*/
}
