import CollectiblesContract from "../contracts/Collectibles.cdc"

transaction {
    prepare(signer: AuthAccount) {
        if signer.borrow<&CollectiblesContract.Collection>(from: /storage/Collection) == nil {
            let collection <-  CollectiblesContract.createCollection()
            signer.save(<-collection, to: /storage/Collection)
            signer.link<&CollectiblesContract.Collection>(/public/Collection, target: /storage/Collection)
        }
    }
}
