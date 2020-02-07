const Droken = artifacts.require('Droken');

contract('Droken Tests', accounts => {

    let droken;

    beforeEach(async() => {
        droken = await Droken.new(5000, { from: accounts[0] });
    });

    it('Contrato se inicia correctamente', async () => {
        const name = await droken.name.call();
        const symbol = await droken.symbol.call();
        const decimals = await droken.decimals.call();
        const totalSupply = await droken.totalSupply.call();
        
        assert.equal(name, 'Droken', 'El nombre del Droken no se inicia correctamente');
        assert.equal(symbol, 'DRK', 'El símbolo del Droken no se inicia correctamente');
        assert.equal(decimals, 18, 'El número de decimales del Droken no se inicia correctamente');
        assert.equal(totalSupply, 5000, 'El número de Drokens creado no se inicia correctamente');
    });

    it('Añadidos nuevos Drokens', async () => {
        const tokensIniciales = await droken.totalSupply.call();
        await droken.mint(1000, { from: accounts[0] });
        const tokensFinales = await droken.totalSupply.call();
        
        assert.equal(Number(tokensFinales), Number(tokensIniciales) + 1000, 'El número total de Drokens existentes no es correcto');
    });    

    it('Solo el owner puede añadir nuevos Drokens', async () => {
        try {
            await droken.mint(1000, { from: accounts[1] });
        } catch(err) {
            // Funcionamiento correcto: No deja minar Drokens
            error = err; 
            assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1, 'Ownable: caller is not the owner');
		}
    });  
    
    it('Drokens transferidos correctamente', async () => {
        const tokensIniciales = await droken.totalSupply.call();
        const saldoInicialFrom = await droken.balanceOf(accounts[0]);
        const saldoInicialTo = await droken.balanceOf(accounts[1]);
        await droken.transfer(accounts[1], 1000);
        const saldoFinalFrom = await droken.balanceOf(accounts[0]);
        const saldoFinalTo = await droken.balanceOf(accounts[1]);
        const tokensFinales = await droken.totalSupply.call();
        
        assert.equal(Number(tokensFinales), Number(tokensIniciales), 'El número total de Drokens existentes no es correcto');
        assert.equal(Number(saldoFinalFrom), Number(saldoInicialFrom) - 1000, 'El salfo final del ordenante no es correcto');
        assert.equal(Number(saldoFinalTo), Number(saldoInicialTo) + 1000, 'El salfo final del destinatario no es correcto');
    }); 

});