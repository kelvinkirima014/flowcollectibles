import Head from 'next/head';
import styles from '../styles/Home.module.css';
import elementStyles from '../styles/Elements.module.css';
import "../flow/config";
import * as fcl from "@onflow/fcl";
import { useState, useEffect } from "react";

export default function Home() {

  const [user, setUser] = useState({loggedIn: null})

  useEffect(() => {
    fcl.currentUser.subscribe(setUser),
    []
  })

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <button className={elementStyles.button} onClick={fcl.unauthenticate}>log out</button>
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
        Collectibles Portal
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
