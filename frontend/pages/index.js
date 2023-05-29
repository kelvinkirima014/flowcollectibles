import Head from 'next/head';
import styles from '../styles/Home.module.css';
import elementStyles from '../styles/Elements.module.css';
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

const TEST_URLS = [
  'https://media.giphy.com/media/wJ8QGSXasDvPy/giphy.gif',
  'https://media.giphy.com/media/3ohzdI8r7iWMLCvTYk/giphy.gif',
  'https://media.giphy.com/media/UTek0q3N8osh8agH4Y/giphy.gif',
  'https://media.giphy.com/media/SJXzadwbexJEAZ9S1B/giphy.gif',
  // 'https://media.giphy.com/media/wJ8QGSXasDvPy/giphy.gif',
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
    fcl.tx(lastTransactionId).subscribe(res => {
      setTransactionStatus(res.statusString);

      //query for new chain string again if status is sealed
      if (isSealed(res.status)) {
        queryChain();
      }
    })


      setCollectiblesList(TEST_URLS);
      console.log('Setting collectibles...');
    }
  }, [user]);

  const queryChain = async () => {
    const res = await fcl.query({
      cadence: FetchCollectibles
    })
    setInputValue(url/res)
  }

  const addCollectible = async (event) => {
    event.preventDefault()

    if (!inputValue.length) {
      throw new Error('Please add a URL...')
    }

    const transactionId = await fcl.mutate({
      cadence: AddCollectible,
      args: (arg, t) => [arg(inputValue, t.string)]
    })

    setLastTransactionId(transactionId)

  }

  const setCollectible = async() => {
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
            setCollectible();
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
        {/* <div>Address: {user?.addr ?? "No Address"} */}
          <div className={elementStyles.collectiblesgrid}>
            {TEST_URLS.map(url => (
              <div className={elementStyles.collectiblesitem} key={url}> 
                <img src={url} alt={url} />
              </div>
            ))}
          </div>
        {/* </div> */}
      </div>
    )
  }

  const RenderUnauthenticatedState = () => {
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
