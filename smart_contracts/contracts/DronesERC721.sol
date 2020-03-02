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

    event DronRegistrado(
        uint256 indexed id,
        address indexed empresa,
        uint256 alturaVueloMinima,
        uint256 alturaVueloMaxima,
        uint256[] pesticidas,
        uint256 coste
    );

    /**
     * @dev Se lanza si la cuenta no es valida
     */
    modifier cuentaValida(address cuenta) {
        require (cuenta != address(0), 'La cuenta no es valida');
        _;
    }

    /**
     * @dev Se lanza si el dron no existe
     */
    modifier dronExiste(uint256 dronId) {
        require (drones[dronId].id == dronId, 'El dron solicitado no existe');
        _;
    }

    /**@dev Devuelve si un dron esta registrado.
     * @param dronId Identificador del dron.
     * @return Booleano indicando si el dron esta registrado.
     */
    function isDron(uint256 dronId) public view returns (bool) {
        return drones[dronId].id == dronId;
    }

    /**@dev Devuelve el numero de drones registrados.
     * @return contador Numero de drones registrados.
     */
    function numeroDrones() public view returns (uint256) {
        return contador;
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

    /**@dev Crea un registro de un nuevo dron
     * @param _empresa Cuenta de la empresa a la que pertenece el dron
     * @param _alturaVueloMinima Altura de vuelo minima del dron
     * @param _alturaVueloMaxima Altura de vuelo maxima del dron
     * @param _pesticidas Pesticidas manejados por el dron
     * @param _coste Coste de contratacion del dron
     */
    function mint(
        address _empresa,
        uint256 _alturaVueloMinima,
        uint256 _alturaVueloMaxima,
        uint256[] memory _pesticidas,
        uint256 _coste
    ) public onlyOwner cuentaValida(_empresa) {
        contador++;

        ERC721._mint(_empresa, contador);

        drones[contador].id = contador;
        drones[contador].empresa = _empresa;
        drones[contador].alturaVueloMinima = _alturaVueloMinima;
        drones[contador].alturaVueloMaxima = _alturaVueloMaxima;
        drones[contador].pesticidas = _pesticidas;
        drones[contador].coste = _coste;

        emit DronRegistrado(contador, _empresa, _alturaVueloMinima, _alturaVueloMaxima, _pesticidas, _coste);
    }

    /**@dev Transfiere la propiedad de un dron
     * @param dronId Identificador del dron
     * @param to Cuenta del nuevo propietario del dron
     */
    function transferirDron(uint256 dronId, address to)
        public
        onlyOwner
        dronExiste(dronId)
        cuentaValida(to)
    {
        ERC721.transferFrom(drones[dronId].empresa, to, dronId);

        drones[dronId].empresa = to;
    }

    /**@dev Elimina el registro de un dron
     * @param dronId Identificador del dron
     */
    function burn(uint256 dronId) public onlyOwner dronExiste(dronId) {
        ERC721._burn(drones[dronId].empresa, dronId);

        drones[dronId].id = 0;
    }
}