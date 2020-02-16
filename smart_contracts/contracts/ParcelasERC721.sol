pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract ParcelasERC721 is ERC721, Ownable {
    struct Parcela {
        uint256 id;
        address empresa;
        uint256 alturaVueloMinima;
        uint256 alturaVueloMaxima;
        uint256 pesticida;
    }

    uint256 private contador = 0;

    mapping(uint256 => Parcela) private parcelas;

    /**
     * @dev Se lanza si es llamado por cualquier cuenta de parcela que no exista
     */
    modifier parcelaExiste(uint256 parcelaId) {
        require(
            parcelas[parcelaId].id == parcelaId,
            "La parcela solicitada no existe"
        );
        _;
    }

    /**@dev Obtiene el total de parcelas existentes.
     * @return Entero indicando el total de parcelas existentes.
     */
    function numeroParcelas() public view returns (uint256) {
        return contador;
    }

    /**@dev Obtiene los datos de una parcela existente.
     * @param parcelaId Identificador de la parcela.
     * @return id Identificador de la parcela.
     * @return empresa Cuenta de la empresa propietaria.
     * @return alturaVueloMinima Altura vuelo mínima permitida en la parcela.
     * @return alturaVueloMaxima Altura vuelo máxima permitida en la parcela.
     * @return pesticida Pesticida aceptado en la parcela.
     */
    function getParcela(uint256 parcelaId)
        public
        view
        parcelaExiste(parcelaId)
        returns (
            uint256 id,
            address empresa,
            uint256 alturaVueloMinima,
            uint256 alturaVueloMaxima,
            uint256 pesticida
        )
    {
        id = parcelas[parcelaId].id;
        empresa = parcelas[parcelaId].empresa;
        alturaVueloMinima = parcelas[parcelaId].alturaVueloMinima;
        alturaVueloMaxima = parcelas[parcelaId].alturaVueloMaxima;
        pesticida = parcelas[parcelaId].pesticida;
    }

    /**@dev Crea nueva parcela.
     * @param _empresa Cuenta de la empresa a la que pertenece.
     * @param _alturaVueloMinima Altura vuelo mínima permitida en la parcela.
     * @param _alturaVueloMaxima Altura vuelo máxima permitida en la parcela.
     * @param _pesticida Pesticida aceptado en la parcela.
     */
    function mint(address _empresa, uint256 _alturaVueloMinima, uint256 _alturaVueloMaxima, uint256 _pesticida)
        public
        onlyOwner
    {
        contador++;

        ERC721._mint(_empresa, contador);

        parcelas[contador].id = contador;
        parcelas[contador].empresa = _empresa;
        parcelas[contador].alturaVueloMinima = _alturaVueloMinima;
        parcelas[contador].alturaVueloMaxima = _alturaVueloMaxima;
        parcelas[contador].pesticida = _pesticida;
    }
}
