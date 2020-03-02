pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

/** @title Empresas.*/
contract Empresas is Ownable {
    struct Empresa {
        address cuenta;
        string nombre;
        string cif;
        bool existe;
    }

    mapping(address => Empresa) private empresas;

    event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);

    /**
     * @dev Se lanza si es llamado por cualquier cuenta de empresa que no exista
     */
    modifier empresaValida(address _cuenta) {
        require(empresas[_cuenta].existe, "La empresa no existe");
        _;
    }

    modifier direccionValida(address direccion) {
        require (direccion != address(0), 'La direccion no es valida');
        _;
    }

    /**@dev Registra una nueva empresa.
     * @param _cuenta Cuenta de la nueva empresa.
     * @param _nombre Nombre de la nueva empresa.
     * @param _cif CIF de la nueva empresa.
     */
    function registrarEmpresa(
        address _cuenta,
        string memory _nombre,
        string memory _cif
    ) public onlyOwner direccionValida(_cuenta) {
        empresas[_cuenta] = Empresa(_cuenta, _nombre, _cif, true);
        emit EmpresaRegistrada(_cuenta, _nombre, _cif);
    }

    /**@dev Obtiene los datos de una empresa existente.
     * @param _cuenta Cuenta de la empresa.
     * @return nombre Nombre recuperado de la empresa.
     * @return cif CIF recuperado de la empresa.
     */
    function getDatosEmpresa(address _cuenta)
        public
        view
        empresaValida(_cuenta)
        returns (string memory nombre, string memory cif)
    {
        nombre = empresas[_cuenta].nombre;
        cif = empresas[_cuenta].cif;
    }

    /**
     * @dev Devuelve si la cuenta corresponde a una empresa.
     * @param _cuenta Cuenta de la empresa.
     * @return Booleano indicando si es empresa o no.
     */
    function isEmpresa(address _cuenta) public view returns (bool) {
        return empresas[_cuenta].existe;
    }
}
