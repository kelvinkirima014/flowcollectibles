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
  'https://media.giphy.com/media/wJ8QGSXasDvPy/giphy.gif',
]

export default function Home() {

  const [ user, setUser ] = useState({loggedIn: null});
  const [ inputValue, setInputValue ] = useState('');
  const [ collectiblesList, setCollectiblesList ] = useState([]);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser),
    []
  })

  useEffect(() => {
    if (user) {
      console.log('Fetching collectibles...');

      //call cadence contract here

      setCollectiblesList(TEST_URLS);
    }
  }, [user]);

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
        <button className={elementStyles.button} onClick={fcl.unauthenticate}>log out</button>
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
