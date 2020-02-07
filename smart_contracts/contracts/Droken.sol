pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Droken is ERC20, ERC20Detailed, Ownable {

    constructor(uint256 initialSupply) ERC20Detailed("Droken", "DRK", 18) public {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }

}