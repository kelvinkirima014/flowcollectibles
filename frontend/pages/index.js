import Head from 'next/head';
import styles from '../styles/Home.module.css';
import elementStyles from '../styles/Elements.module.css';
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

const TEST_COLLECTIBLES = [
  'https://apod.nasa.gov/apod/image/2305/M27_Cosgrove_2717.jpg',
  'https://apod.nasa.gov/apod/image/2305/SeaBlueSky_Horalek_960.jpg',
  'https://apod.nasa.gov/apod/image/2305/virgoCL2048.jpg',
  'https://apod.nasa.gov/apod/image/1601/2013US10_151221_1200Chambo.jpg',
  // 'https://apod.nasa.gov/apod/image/2005/LDN1471_HubbleSchmidt_1024.jpg',
]

export default function Home() {

  const [ user, setUser ] = useState({loggedIn: null});
  const [ inputValue, setInputValue ] = useState('');
  const [ collectiblesList, setCollectiblesList ] = useState([]);
  const [ lastTransactionId, setLastTransactionId ] = useState();
  const [ transactionStatus, setTransactionStatus ] = useState('N/A');

  useEffect(() => {
    fcl.currentUser.subscribe(setUser),
    []
  })

  useEffect(() => {
    if (user) {
      
    //call cadence contract here


    // fcl.tx(lastTransactionId).subscribe(res => {
    //   setTransactionStatus(res.statusString);

    //   //query for new chain string again if status is sealed
    //   if (isSealed(res.status)) {
    //     queryChain();
    //   }
    // })


      setCollectiblesList(TEST_COLLECTIBLES);
      console.log('Setting collectibles...');
    }
  }, [user]);

  // const queryChain = async () => {
  //   const res = await fcl.query({
  //     cadence: FetchCollectibles
  //   })
  //   setInputValue(url/res)
  // }

  // const addCollectible = async (event) => {
  //   event.preventDefault()

  //   if (!inputValue.length) {
  //     throw new Error('Please add a URL...')
  //   }

  //   const transactionId = await fcl.mutate({
  //     cadence: AddCollectible,
  //     args: (arg, t) => [arg(inputValue, t.string)]
  //   })

  //   setLastTransactionId(transactionId)

  // }

  const saveCollectible = async() => {
    if (inputValue.length > 0) {
      console.log('Collectibles url: ', inputValue);
      setCollectiblesList([...collectiblesList, inputValue]);
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
            saveCollectible();
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
        Collectibles Portal
      </h1>
      <p className={elementStyles.subtext}>
        Upload your Favorite Collectibles to the Flow chain
      </p>
      {user.loggedIn
        ? <RenderAuthedState />
        : <RenderUnauthenticatedState /> 
      }
    </main>

    </div>
  )
}
