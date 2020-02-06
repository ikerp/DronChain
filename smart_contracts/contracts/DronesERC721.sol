pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract DronesERC721 is ERC721, Ownable {

    struct Dron {
        uint256 id;
        address empresa;
        uint256[] alturasVuelo;
        uint256[] pesticidas;
        uint256 coste;
    }

    uint256 private contador = 0;
    mapping(uint256 => Dron) private drones;

    modifier dronExiste(uint256 dronId) {
        require (drones[dronId].id == dronId, 'El dron solicitado no existe.');
        _;
    }

    function numeroDrones() public view returns (uint256) {
        return contador;
    }

    function getDron(uint256 dronId) public view dronExiste(dronId) returns (uint256, address, uint256[] memory, uint256[] memory, uint256) {
        return (
            drones[dronId].id,
            drones[dronId].empresa,
            drones[dronId].alturasVuelo,
            drones[dronId].pesticidas,
            drones[dronId].coste
        );
    }

    function mint(uint256[] memory _alturasVuelo, uint256[] memory _pesticidas, uint256 _coste) public returns (uint256) {
        contador++;
        drones[contador].id = contador;
        drones[contador].empresa = msg.sender;
        drones[contador].alturasVuelo = _alturasVuelo;
        drones[contador].pesticidas = _pesticidas;
        drones[contador].coste = _coste;
        return contador;
    }
}