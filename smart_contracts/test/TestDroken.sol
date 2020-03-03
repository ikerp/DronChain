pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Droken.sol";

contract TestDroken {

    Droken droken;

    function beforeEach() public {
        droken = new Droken(5000);
    }

    function testContratoSeIniciaCorrectamente() public {
        Assert.equal(droken.name(), "Droken", "El nombre del Droken no se inicia correctamente");
        Assert.equal(droken.symbol(), "DRK", "El símbolo del Droken no se inicia correctamente");
        Assert.equal(droken.decimals(), uint(18), "El número de decimales del Droken no se inicia correctamente");
        Assert.equal(droken.totalSupply(), 5000, "El número de Drokens creado no se inicia correctamente");
    }

}