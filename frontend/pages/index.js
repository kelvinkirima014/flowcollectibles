import Head from 'next/head';
import styles from '../styles/Home.module.css';
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
        <button type='submit' className='styles.card' onClick={fcl.unauthenticate}>log out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button type='submit' className='styles.card' onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
     <Head>
      <title>Flow collectibles Portal</title>
      <meta name='description' content='A collectibles portal on Flow' />
      <link rel='icon' href='/favicon.png' />
     </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>
        Collectibles Portal
      </h1>
      <p className={styles.description}>
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
