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
import { randomInt } from 'crypto';

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
    getCollectibles(accountAddress, id);
  }, []);

  useEffect(() => {
    if (user) {
      getCollectibles(accountAddress, id);
      console.log('Fetching collectibles...');
    }
  }, [user]);

  const getCollectibles = async (accountAddress, id) => {
  const res = await fcl.query({
    cadence: ` 
         import CollectiblesContract from 0x08496c58edd75c89 
         pub fun main(accountAddress: Address, id: UInt64): &CollectiblesContract.Collectible? {
            let collectionRef = getAccount(accountAddress)
            .getCapability<&CollectiblesContract.Collection>(/public/Collection)
            .borrow()
            ?? panic("Could not borrow Collection reference")
          return collectionRef.fetchCollectibles(id: id)
      }`,
    args: (arg, t) => [arg(accountAddress, t.Address), arg(id, t.UInt64)],
  });
  setCollectiblesList(res);
};

  const saveCollectible = async () => {
    if (inputRef.current.value.length > 0) {
      console.log("Collectible url: ", inputRef.current.value)

      const transactionId = fcl.mutate({
        cadence: `
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
        args: (arg, t) => [
          arg(inputRef.current.value, t.String)
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999
      })

      console.log('Transaction Id: ', transactionId);
      getCollectibles()
      setCollectiblesList([...collectiblesList, inputRef.current.value]);
      inputRef.current.value = '';
    } else {
      console.log('Empty input. Try again.');
    }
    return false
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
