const parcelaPendienteFumigar = (dronChain, parcelaId) => 
    new Promise((resolve, reject) => {

        let fumigacionesPendientes = [];
    
        try {
            dronChain.getPastEvents('DronContratado', {
                fromBlock:0,
                toBlock:'latest'            
            })
            .then(eventos => {
                fumigacionesPendientes = eventos.filter(evento => 
                    Number(evento.returnValues.parcelaId) === Number(parcelaId)
                ).map(ev => 
                    ev.returnValues.dronId
                );
        
                dronChain.getPastEvents('ParcelaFumigada', {
                    fromBlock:0,
                    toBlock:'latest'            
                })
                .then(eventos => {
                    eventos.filter(evento => 
                        Number(evento.returnValues.parcelaId) === Number(parcelaId)
                    ).map(ev => {
                        let index = fumigacionesPendientes.indexOf(ev.returnValues.dronId);
                        if (index !== -1) {
                            fumigacionesPendientes.splice(index, 1);
                        }
                    });   

                    resolve(fumigacionesPendientes.length !== 0);
                })  
            })
        } catch (error) {
            console.error('ERROR en Promise parcelaPendienteFumigar');
            reject(); 
        }
    });

export default parcelaPendienteFumigar;