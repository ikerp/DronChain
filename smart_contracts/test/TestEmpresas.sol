pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "../contracts/Empresas.sol";

contract TestEmpresas {
    Empresas empresas;
    address constant CUENTA_1 = 0xF6e62ba670964ae46c739B0C39f9296Ac6E56595;
    address constant CUENTA_2 = 0x69D1B844508E3E60BDA596462BB758939021B131;
    string nombreEmpresa = "Empresa 1";
    string cifEmpresa = "B26111111";

    function beforeEach() public {
        empresas = new Empresas();
    }

    function testContratoSeIniciaCorrectamente() public {
        Assert.equal(
            empresas.owner(),
            address(this),
            "El contrato no se inicia correctamente"
        );
    }

    function testRegistradaNuevaEmpresa() public {
        empresas.registrarEmpresa(CUENTA_1, nombreEmpresa, cifEmpresa);
        (string memory nombreRecuperado, string memory cifRecuperado) = empresas
            .getDatosEmpresa(CUENTA_1);

        Assert.equal(
            nombreRecuperado,
            nombreEmpresa,
            "El nombre de la empresa no es correcto"
        );
        Assert.equal(
            cifRecuperado,
            cifEmpresa,
            "El CIF de la empresa no es correcto"
        );
    }

    function testSoloElOwnerPuedeRegistrarNuevasEmpresas() public {
        // Deberia ser true y se obtiene false ----------------------------------------------------
        (bool result, ) = empresas.owner().call(
            abi.encodePacked(
                empresas.registrarEmpresa.selector,
                abi.encode(CUENTA_1, nombreEmpresa, cifEmpresa)
            )
        );

        Assert.isFalse(result, "Solo el owner debería poder añadir Empresas");
    }

    function testNoSeRecuperanDatosDeEmpresaQueNoExiste() public {
        (bool result, ) = address(this).call(
            abi.encodePacked(
                empresas.getDatosEmpresa.selector,
                abi.encode(CUENTA_2)
            )
        );

        Assert.isFalse(result, "No se deberían recuperar datos de una empresa que no existe");
    }

    function testLaCuentaCorrespondeAUnaEmpresaExistente() public {
        empresas.registrarEmpresa(CUENTA_1, nombreEmpresa, cifEmpresa);
        bool existe = empresas.isEmpresa(CUENTA_1);

        Assert.isTrue(existe, "La existencia de la empresa no se valida correctamente");
    }
}
