import CollectiblesContract from "../contracts/Collectibles.cdc"

// Script to view Collectible by id
pub fun main(accountAddress: Address, id: UInt64): &CollectiblesContract.Collectible? {
    let collectionRef = getAccount(accountAddress)
        .getCapability<&CollectiblesContract.Collection>(/public/Collection)
        .borrow()
        
    if let ref = collectionRef {
        return ref.fetchCollectibles(id: id)
    } else {
        return nil
    }
}
