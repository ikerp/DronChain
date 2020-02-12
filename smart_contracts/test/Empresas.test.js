const Empresas = artifacts.require("Empresas");
const truffleAssert = require("truffle-assertions");

contract("Empresas Tests", accounts => {
    let empresas;

    beforeEach(async () => {
        empresas = await Empresas.new({ from: accounts[0] });
    });

    it("Contrato se inicia correctamente", async () => {
        const owner = await empresas.owner.call();

        assert.equal(owner, accounts[0], "El contrato no se inicia correctamente");
    });

    it("Registrada nueva Empresa", async () => {
        const tx = await empresas.registrarEmpresa(
            accounts[1],
            "Empresa 1",
            "B26111111",
            { from: accounts[0] }
        );

        // event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);
        truffleAssert.eventEmitted(tx, "EmpresaRegistrada", ev => {
            return (
                ev._cuenta == accounts[1] &&
                ev._nombre == "Empresa 1" &&
                ev._cif == "B26111111"
            );
        });
    });

    it("Solo el owner puede registrar nuevas Empresas", async () => {
        try {
            await empresas.registrarEmpresa(accounts[2], "Empresa 2", "B26222222", {
                from: accounts[1]
            });
        } catch (err) {
            // Funcionamiento correcto: No deja registrar nuevas Empresas si no es owner
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

    it("Recuperados datos de Empresa que existe", async () => {
        const tx = await empresas.registrarEmpresa(
            accounts[2],
            "Empresa 2",
            "B26222222",
            { from: accounts[0] }
        );
        const { nombre, cif } = await empresas.getDatosEmpresa(accounts[2]);

        // event EmpresaRegistrada(address _cuenta, string _nombre, string _cif);
        truffleAssert.eventEmitted(tx, "EmpresaRegistrada", ev => {
            return (
                ev._cuenta == accounts[2] &&
                ev._nombre == "Empresa 2" &&
                ev._cif == "B26222222"
            );
        });
        assert.equal(
            nombre,
            "Empresa 2",
            "El nombre de la empresa no se inicia correctamente"
        );
        assert.equal(
            cif,
            "B26222222",
            "El CIF de la empresa no se inicia correctamente"
        );
    });

    it("No se recuperan datos de Empresa que no existe", async () => {
        var error;
        try {
            await empresas.getDatosEmpresa(accounts[1]);
        } catch (err) {
            // Este es el funcionamiento correcto
            // No deja recuperar los datos de empresa
            error = err;
        }
        assert.isAbove(
            error.message.search("VM Exception while processing transaction: revert"),
            -1,
            "La empresa no existe"
        );
    });
});
