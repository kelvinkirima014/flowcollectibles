import CollectiblesContract from "../contracts/Collectibles.cdc"

//script to view Collection by id



    pub fun main(accountAddress: Address, id: UInt64): Bool {
        let collectionRef = getAccount(accountAddress)
          .getCapability<&CollectiblesContract.Collection>(/public/Collection)
          .borrow()

        return collectionRef != nil
    }
