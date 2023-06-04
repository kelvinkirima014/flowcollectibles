import Head from 'next/head';
import styles from '../styles/Home.module.css';
import elementStyles from '../styles/Elements.module.css';
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

// const TEST_COLLECTIBLES = [
//   'https://apod.nasa.gov/apod/image/2305/M27_Cosgrove_2717.jpg',
//   'https://apod.nasa.gov/apod/image/2305/SeaBlueSky_Horalek_960.jpg',
//   'https://apod.nasa.gov/apod/image/2305/virgoCL2048.jpg',
//   'https://apod.nasa.gov/apod/image/1601/2013US10_151221_1200Chambo.jpg',
//   'https://apod.nasa.gov/apod/image/2005/LDN1471_HubbleSchmidt_1024.jpg',
// ]

export default function Home() {

  const [ user, setUser ] = useState({loggedIn: null});
  const [ inputValue, setInputValue ] = useState('');
  const [ collectiblesList, setCollectiblesList ] = useState([]);
  

  //keeps track of the loged in user
  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
    getCollectibles();
  }, [])

  useEffect(() => {
    if (user) {
      getCollectibles();
      console.log('Fetching collectibles...');
    }
  }, [user]);

  const getCollectibles = async () => {
    const res = await fcl.query({
      cadence: `
      import CollectiblesContract from 0xf8d6e0586b0a20c7

      pub fun main(accountAddress: Address, id: UInt64): &CollectiblesContract.Collectible? {
          let collectionRef = getAccount(accountAddress)
          .getCapability<&CollectiblesContract.Collection>(/public/Collection)
          .borrow()
          ?? panic("Could not borrow Collection reference")
         return collectionRef.fetchCollectibles(id: id)
     }
      `,
      args: (_arg, _t) => []
    })
    setCollectiblesList(res)
  }


  const saveCollectible = async(event) => {
    event.preventDefault()
    if (inputValue.length > 0) {
      console.log("Collectible url: ", inputValue)

      const transactionId = fcl.mutate({
        cadence: `
        import CollectiblesContract from 0xf8d6e0586b0a20c7


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
          arg(inputValue, t.String)
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999
      })
     
      console.log('Transaction Id: ', transactionId);
      getCollectibles()
      setCollectiblesList((prevCollectiblesList) => [...prevCollectiblesList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Please add a collectible');
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const RenderAuthedState = () => {
    return (
      <div className={elementStyles.authedcontainer}>
        <form 
          onSubmit={(event) => {
            event.preventDefault();
            saveCollectible(event);
          }}
        >
          <input 
            type='text' 
            placeholder='Enter a URL to your collectible' 
            name='submitcol'
            value={inputValue}
            onChange={onInputChange}  
          />
          <button type='submit' className={elementStyles.submitbutton}>
            Submit
          </button>
        </form>
          <div className={elementStyles.collectiblesgrid}>
            {/* Map through collectiblesList instead of TEST_COLLECTIBLES */}
            {collectiblesList.map(url => (
              <div className={elementStyles.collectiblesitem} key={url}> 
                <img src={url} alt={url} />
              </div>
            ))}
          </div>
      </div>
    )
  }

  const RenderUnauthenticatedState = () => {
    return (
      <div>
        <button className={elementStyles.button} onClick={fcl.logIn}>Log In</button>
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
        Upload your Favorite Collectibles to the Flow Blockchain
      </p>
      {user.loggedIn
        ? <RenderAuthedState />
        : <RenderUnauthenticatedState /> 
      }
    </main>

    </div>
  )

}

