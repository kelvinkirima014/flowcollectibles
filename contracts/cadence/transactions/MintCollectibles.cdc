import CollectiblesContract from "../contracts/Collectibles.cdc"
//To interact with the Collection, 
//you can create transactions for minting Collectibles and scripts for viewing the Collectibles. 
//For example, here's a transaction to mint a new Collectible:


transaction(url: String) {
    let receiver: &{CollectiblesContract.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.receiver = signer.borrow<&CollectiblesContract.Collection>(from: /storage/Collection)
            ?? panic("could not borrow Collection reference")
    }

    execute {
        let collectible <- CollectiblesContract.mintCollectibles(url: url)
        self.receiver.addCollectibles(collectible: <-collectible)
    }
}
