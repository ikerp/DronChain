pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "../contracts/Droken.sol";

contract TestDroken {
    Droken droken;
    address constant CUENTA_1 = 0xF6e62ba670964ae46c739B0C39f9296Ac6E56595;

    function beforeEach() public {
        droken = new Droken(5000);
    }

    function testEstablecidoOwnerAlIniciarContrato() public {
        Assert.equal(
            droken.owner(),
            address(this),
            "El owner es diferente al que ha desplegado el contrato"
        );
    }

    function testContratoSeIniciaCorrectamente() public {
        Assert.equal(
            droken.name(),
            "Droken",
            "El nombre del Droken no se inicia correctamente"
        );
        Assert.equal(
            droken.symbol(),
            "DRK",
            "El símbolo del Droken no se inicia correctamente"
        );
        Assert.equal(
            droken.decimals(),
            uint256(18),
            "El número de decimales del Droken no se inicia correctamente"
        );
        Assert.equal(
            droken.totalSupply(),
            5000,
            "El número de Drokens creado no se inicia correctamente"
        );
    }

    function testAniadidosNuevosDrokens() public {
        uint256 tokensIniciales = droken.totalSupply();
        droken.mint(1000, droken.owner());
        uint256 tokensFinales = droken.totalSupply();
        uint256 tokensEsperados = tokensIniciales + 1000;

        Assert.equal(
            tokensFinales,
            tokensEsperados,
            "El número total de Drokens existentes no es correcto"
        );
    }

    function testSoloElOwnerPuedeAniadirNuevosDrokens() public {
        // Deberia ser true y se obtiene false ----------------------------------------------------
        (bool result, ) = droken.owner().call(
            abi.encodePacked(
                droken.mint.selector,
                abi.encode(uint256(1000), address(droken.owner()))
            )
        );

        Assert.isFalse(result, "Solo el owner debería poder añadir Drokens");
    }

    function testDrokensTransferidosCorrectamente() public {
        uint256 tokensIniciales = droken.totalSupply();
        uint256 saldoInicialFrom = droken.balanceOf(droken.owner());
        uint256 saldoInicialTo = droken.balanceOf(CUENTA_1);
        droken.transfer(CUENTA_1, 1000);
        uint256 saldoFinalFrom = droken.balanceOf(droken.owner());
        uint256 saldoFinalTo = droken.balanceOf(CUENTA_1);
        uint256 tokensFinales = droken.totalSupply();

        Assert.equal(
            tokensFinales,
            tokensIniciales,
            "El número total de Drokens existentes no es correcto"
        );
        Assert.equal(
            saldoFinalFrom,
            saldoInicialFrom - 1000,
            "El saldo final del ordenante no es correcto"
        );
        Assert.equal(
            saldoFinalTo,
            saldoInicialTo + 1000,
            "El saldo final del destinatario no es correcto"
        );
    }
}
