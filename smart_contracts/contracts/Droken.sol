pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

/** @title Droken.*/
contract Droken is ERC20, ERC20Detailed, Ownable {
    /**@dev Crea un nuevo token con los siguientes parámetros:
     * - Nombre: Droken
     * - Símbolo: DRK
     * - Número de decimales utilizados para obtener su representación: 18
     * @param initialSupply Cantidad de tokens (Droken) a crear.
     */
    constructor(uint256 initialSupply)
        public
        ERC20Detailed("Droken", "DRK", 18)
    {
        _mint(msg.sender, initialSupply);
    }

    /**@dev Crea nuevos tokens (Droken) y los asigna a la cuenta incrementando la cantidad total.
     * @param amount Cantidad de tokens (Droken) a crear.
     */
    function mint(uint256 amount, address to) public onlyOwner {
        _mint(to, amount);
    }

}
