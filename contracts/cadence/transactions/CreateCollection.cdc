import CollectiblesContract from "../contracts/Collectibles.cdc"

//This transaction checks if the user's account already has a Collection resource in storage. 
//If not, it creates a new Collection, saves it to the /storage/Collection path, 
//and creates a public capability at /public/Collection.

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&CollectiblesContract.Collection>(from: /storage/Collection) == nil {
            let collection <-  CollectiblesContract.createCollection()
            signer.save(<-collection, to: /storage/Collection)
            signer.link<&CollectiblesContract.Collection>(/public/Collection, target: /storage/Collection)
        }
    }
}

//To interact with the Collection, 
//you can create transactions for minting Collectibles and scripts for viewing the Collectibles. 

