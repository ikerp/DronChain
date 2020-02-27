const contratosPendientesDron = (dronChain, dronId) => 
    new Promise((resolve, reject) => {

        let contratosPendientes = [];
    
        try {
            dronChain.getPastEvents('DronContratado', {
                fromBlock:0,
                toBlock:'latest'            
            })
            .then(eventos => {
                contratosPendientes = eventos.filter(evento => 
                    Number(evento.returnValues.dronId) === Number(dronId)
                ).map(ev => 
                    ev.returnValues.parcelaId
                );
        
                dronChain.getPastEvents('ParcelaFumigada', {
                    fromBlock:0,
                    toBlock:'latest'            
                })
                .then(eventos => {
                    eventos.filter(evento => 
                        Number(evento.returnValues.dronId) === Number(dronId)
                    ).map(ev => {
                        let index = contratosPendientes.indexOf(ev.returnValues.parcelaId);
                        if (index !== -1) {
                            contratosPendientes.splice(index, 1);
                        }
                    });   

                    resolve(contratosPendientes);
                })  
            })
        } catch (error) {
            console.error('ERROR en Promise contratosPendientesDron');
            reject(); 
        }
    });

export default contratosPendientesDron;