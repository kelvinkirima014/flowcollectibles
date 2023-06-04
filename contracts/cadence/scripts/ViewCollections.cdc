import CollectiblesContract from "../contracts/Collectibles.cdc"

//script to view Collection by id

pub fun main(accountAddress: Address, id: UInt64): &CollectiblesContract.Collectible? {
  let collectionRef = getAccount(accountAddress)
      .getCapability<&CollectiblesContract.Collection>(/public/Collection)
      .borrow()
      ?? panic("Could not borrow Collection reference")
  return collectionRef.fetchCollectibles(id: id)
}

