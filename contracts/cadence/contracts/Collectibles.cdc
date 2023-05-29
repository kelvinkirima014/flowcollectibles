pub contract  Collectibles {
    
    pub resource Collection {
        pub var collectibles: {String: String}


        init(owner: Address) {
            
            self.collectibles = {}
        }

        pub fun addCollectible(url: String) {
            self.collectibles[url] = url
        }

        pub fun getCollectibles(): {String: String}{
            return self.collectibles
        }
    }

    pub resource AllCollections  {
        pub var collections: @{Address: Collection}

        init() {
            self.collections <- {}
        }

        pub fun createCollection(address: Address) {
            let newCollection <- create Collection(owner: address)
            self.collections[<-address] = <-newCollection
        }

        pub fun getCollection(address: Address): Collection? {
            return self.collections[address]
        }
    }

    pub fun createCollection(): Collections {
        let address = getAccount(Address.self).address
        let allCollections <- fetchAllCollections()
        let collection = allCollections.getCollection(address)

        if let existingCollection = collection {
            return existingCollection
        } else {
            let newCollection <- create Collection (owner: address)
            allCollections.collections[<-address] = <-newCollection
            return <- newCollection
        }
    }
    pub fun fetchAllCollections(): &AllCollections {
        return &AllCollections.singleton
    }
}