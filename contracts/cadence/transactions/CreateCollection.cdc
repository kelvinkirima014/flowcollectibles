import CollectiblesContract from "../contracts/Collectibles.cdc"

//This transaction checks if the user's account already has an NFTCollection resource in storage. I
//f not, it creates a new NFTCollection, saves it to the /storage/NFTCollection path, 
//and creates a public capability at /public/NFTCollection.

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&CollectiblesContract.Collection>(from: /storage/Collection) == nil {
            let collection <-  CollectiblesContract.createCollection()
            signer.save(<-collection, to: /storage/Collection)
            signer.link<&CollectiblesContract.Collection>(/public/Collection, target: /storage/Collection)
        }
    }
}

