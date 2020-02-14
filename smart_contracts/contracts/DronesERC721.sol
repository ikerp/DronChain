pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract DronesERC721 is ERC721, Ownable {

    struct Dron {
        uint256 id;
        address empresa;
        uint256 alturaVueloMinima;
        uint256 alturaVueloMaxima;
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

    function getDron(uint256 dronId) public view dronExiste(dronId) returns (
        uint256 id,
        address empresa,
        uint256 alturaVueloMinima,
        uint256 alturaVueloMaxima,
        uint256[] memory pesticidas,
        uint256 coste
        ) {
            id = drones[dronId].id;
            empresa = drones[dronId].empresa;
            alturaVueloMinima = drones[dronId].alturaVueloMinima;
            alturaVueloMaxima = drones[dronId].alturaVueloMaxima;
            pesticidas = drones[dronId].pesticidas;
            coste = drones[dronId].coste;
    }

    function mint(
        address _empresa,
        uint256 _alturaVueloMinima,
        uint256 _alturaVueloMaxima,
        uint256[] memory _pesticidas,
        uint256 _coste
        ) public onlyOwner returns (uint256) {
        contador++;

        ERC721._mint(msg.sender, contador);

        drones[contador].id = contador;
        drones[contador].empresa = _empresa;
        drones[contador].alturaVueloMinima = _alturaVueloMinima;
        drones[contador].alturaVueloMaxima = _alturaVueloMaxima;
        drones[contador].pesticidas = _pesticidas;
        drones[contador].coste = _coste;
        return contador;
    }

    function transferirDron(uint256 dronId, address to) public {
        ERC721.transferFrom(drones[dronId].empresa, to, dronId);

        drones[dronId].empresa = to;
    }
}