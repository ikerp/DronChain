# DronChain

DronChain is a DApp for crop-spraying drone management over the Ethereum blockchain. It allows to register new drones and plots to their owners, to hire an available drone to a plot owner and to approve that hiring to the drone owner.

## Description

DronChain uses the ERC721 token standard for modelling the drones and the plots and defines its own ERC20 token as the value exchange unit between the plot owners and the drone owner.  
The contract architecture follows a business-logic/database distinction allowing the persistence of all data registered (drones, plots, users) while the main logic of the application (DronChain.sol) might be upgraded in the future.  
All contracts inherit from the Ownable standard: in the case of the main contract DronChain.sol this owner is the deployer and serves as a protector for the most sensitive functions, but for the rest of the contracts the owner is the instance of DronChain ensuring that all the calls to those contract are made from that istance of the main contract.  
All stardard contracts used in this project are from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts).

## Getting Started

### Deploying the contracts

### Testing the contracts

```

```

## Authors

[oscortiz](https://github.com/oscortiz)  
[ikerp](https://github.com/ikerp)
