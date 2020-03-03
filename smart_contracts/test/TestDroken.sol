pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Droken.sol";

contract TestDroken {

    Droken droken;
    address constant ADDRESS_NULL = 0x0000000000000000000000000000000000000000;
    address constant CUENTA_1 = 0xF6e62ba670964ae46c739B0C39f9296Ac6E56595;

    function beforeEach() public {
        droken = new Droken(5000);
    }

    function testContratoSeIniciaCorrectamente() public {
        Assert.equal(droken.name(), "Droken", "El nombre del Droken no se inicia correctamente");
        Assert.equal(droken.symbol(), "DRK", "El símbolo del Droken no se inicia correctamente");
        Assert.equal(droken.decimals(), uint(18), "El número de decimales del Droken no se inicia correctamente");
        Assert.equal(droken.totalSupply(), 5000, "El número de Drokens creado no se inicia correctamente");
    }

    function testAniadidosNuevosDrokens() public {
        uint256 tokensIniciales = droken.totalSupply();
        droken.mint(1000, droken.owner());
        uint256 tokensFinales = droken.totalSupply();
        uint256 tokensEsperados = tokensIniciales + 1000;
        
        // Falta testear el evento    

        Assert.equal(tokensFinales, tokensEsperados, "El número total de Drokens existentes no es correcto");
    }

    function testSoloElOwnerPuedeAniadirNuevosDrokens() public {         
        droken.mint(1000, droken.owner(), { from: accounts[1] });
    }
/*
    it("Añadidos nuevos Drokens", async () => {
        const tokensIniciales = await droken.totalSupply.call();
        const tx = await droken.mint(1000, accounts[0], { from: accounts[0] });
        const tokensFinales = await droken.totalSupply.call();

        // emit Transfer(sender, recipient, amount);
        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            return (
                ev.from == address0 &&
                ev.to == accounts[0] &&
                ev.value == 1000
            );
        });  
        assert.equal(
            Number(tokensFinales),
            Number(tokensIniciales) + 1000,
            "El número total de Drokens existentes no es correcto"
        );
    });

    it("Solo el owner puede añadir nuevos Drokens", async () => {
        try {
            await droken.mint(1000, accounts[0], { from: accounts[1] });
        } catch (err) {
            // Funcionamiento correcto: No deja minar Drokens
            error = err;
            assert.isAbove(
                error.message.search(
                    "VM Exception while processing transaction: revert"
                ),
                -1,
                "Ownable: caller is not the owner"
            );
        }
    });

    it("Drokens transferidos correctamente", async () => {
        const tokensIniciales = await droken.totalSupply.call();
        const saldoInicialFrom = await droken.balanceOf(accounts[0]);
        const saldoInicialTo = await droken.balanceOf(accounts[1]);
        const tx = await droken.transfer(accounts[1], 1000);
        const saldoFinalFrom = await droken.balanceOf(accounts[0]);
        const saldoFinalTo = await droken.balanceOf(accounts[1]);
        const tokensFinales = await droken.totalSupply.call();

        // emit Transfer(sender, recipient, amount);
        truffleAssert.eventEmitted(tx, "Transfer", ev => {
            return (
                ev.from == accounts[0] &&
                ev.to == accounts[1] &&
                ev.value == 1000
            );
        });        
        assert.equal(
            Number(tokensFinales),
            Number(tokensIniciales),
            "El número total de Drokens existentes no es correcto"
        );
        assert.equal(
            Number(saldoFinalFrom),
            Number(saldoInicialFrom) - 1000,
            "El saldo final del ordenante no es correcto"
        );
        assert.equal(
            Number(saldoFinalTo),
            Number(saldoInicialTo) + 1000,
            "El saldo final del destinatario no es correcto"
        );
    });
*/

}
