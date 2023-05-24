import '../styles/globals.css';
import Home from './index'
import { config } from '@onflow/fcl';

function MyApp({ Component, pageProps }) {
  return (
    <Home>
      <Component {...pageProps} />
    </Home>
  )
}

export default MyApp
