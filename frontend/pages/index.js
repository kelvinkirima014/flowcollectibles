import Head from 'next/head';
import styles from '../styles/Home.module.css';
import elementStyles from '../styles/Elements.module.css';
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { useState, useEffect, useRef } from "react";

// const TEST_COLLECTIBLES = [
//  'https://apod.nasa.gov/apod/image/2305/M27_Cosgrove_2717.jpg',
//  'https://apod.nasa.gov/apod/image/2305/SeaBlueSky_Horalek_960.jpg',
//  'https://apod.nasa.gov/apod/image/2305/virgoCL2048.jpg',
//  'https://apod.nasa.gov/apod/image/1601/2013US10_151221_1200Chambo.jpg'
// ]

import { setEnvironment } from '@onflow/flow-cadut';
import { UInt64 } from '@onflow/types';


(async () => {
  await setEnvironment('testnet');
})();

export default function Home() {
  const [user, setUser] = useState({loggedIn: null})
  const inputRef = useRef();
  const [collectiblesList, setCollectiblesList] = useState([]);
  let id = 0;
  const accountAddress = "0xf8d6e0586b0a20c7"

  
  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
    createCollection();
    getCollectibles(accountAddress, id);
  }, []);

  useEffect(() => {
    if (user) {
      getCollectibles(accountAddress, id);
      console.log('Fetching collectibles...');
    }
  }, [user]);


  const createCollectionCode = `
  import CollectiblesContract from 0x08496c58edd75c89

  transaction {
    prepare(signer: AuthAccount) {
      if signer.borrow<&CollectiblesContract.Collection>(from: /storage/Collection) == nil {
        let collection <- CollectiblesContract.createCollection()
        signer.save(<-collection, to: /storage/Collection)
        signer.link<&CollectiblesContract.Collection>(/public/Collection, target: /storage/Collection)
      }
    }
  }
`;

const createCollection = async () => {
  const response = await fcl.send([
    fcl.transaction`${createCollectionCode}`,
    fcl.proposer(fcl.currentUser),
    fcl.authorizations([fcl.currentUser]),
    fcl.payer(fcl.currentUser),
    fcl.limit(9999),
  ]);

  await fcl.tx(response).onceSealed();
};



const getCollectibles = async (accountAddress, id) => {
  const res = await fcl.query({
    cadence: `
      import CollectiblesContract from 0x08496c58edd75c89

      pub fun main(accountAddress: Address, id: UInt64): Bool {
        let collectionRef = getAccount(accountAddress)
          .getCapability<&CollectiblesContract.Collection>(/public/Collection)
          .borrow()

        return collectionRef != nil
      }
    `,
    args: (arg, t) => [
      arg(accountAddress, t.Address),
      arg(id, t.UInt64)
    ]
  })

  if (res) {
    setCollectiblesList(res)
    return true
  } else {
    return false
  }
}


 const saveCollectible = async () => {
  if (inputRef.current.value.length > 0) {
    console.log("Collectible url: ", inputRef.current.value);

    const response = await fcl.send([
      fcl.transaction`
        import CollectiblesContract from 0x08496c58edd75c89

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
      `,
      fcl.args([fcl.arg(inputRef.current.value, fcl.String)]),
      fcl.proposer(fcl.currentUser),
      fcl.authorizations([fcl.currentUser]),
      fcl.payer(fcl.currentUser),
      fcl.limit(999),
    ]);

    const transactionId = response.transactionId;
    console.log('Transaction Id: ', transactionId);

    await fcl.tx(response).onceSealed();

    getCollectibles(accountAddress, id);
    setCollectiblesList([...collectiblesList, inputRef.current.value]);
    inputRef.current.value = '';
  } else {
    console.log('Empty input. Try again.');
  }
  return false;
};

  const AuthedState = () => {
    return (
      <div className={elementStyles.authedcontainer}>
        <form onSubmit={(event) => {
          event.preventDefault();
          saveCollectible();
          }}
        >
          <input
            type="text"
            placeholder="Enter a URL to your collectible!"
            ref={inputRef}
          />
          <button type='submit' className={elementStyles.submitbutton}>
            Submit
          </button>
        </form>
        <div className={elementStyles.collectiblesgrid}>
          {/* Map through collectiblesList instead of TEST_COLLECTIBLES */}
          { collectiblesList.map(url => (
              <div className={elementStyles.collectiblesitem} key={url}>
                <img src={url} alt={url} />
              </div>
            ))}
        </div>
      </div>
    )
  }

  const UnauthenticatedState = () => {
	return (
  	<div>
    	<button className={elementStyles.button} onClick={fcl.logIn}>Connect Wallet</button>
  	</div>
	)
  }

  return (
	<div className={styles.app}>
 	<Head>
  	<title>Flow collectibles Portal</title>
  	<meta name='description' content='A collectibles portal on Flow' />
  	<link rel='icon' href='/favicon.png' />
 	</Head>

	<main className={styles.main}>
  	<h1 className={elementStyles.header}>
        🖼 Collectibles Portal
  	</h1>
  	<p className={elementStyles.subtext}>
    	Upload your Favorite Collectibles to the Flow chain
  	</p>
  	{user.loggedIn
    	? <AuthedState />
    	: <UnauthenticatedState />
    	}
	</main>

	</div>
  )
}
