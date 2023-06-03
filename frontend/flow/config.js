import { config } from "@onflow/fcl";

config ({
  "app.detail.icon": "https://i.imgur.com/ux3lYB9.png",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xAccountAddress": "process.env.NEXT_PUBLIC_CONTRACT_ADDRESS", // this auto configures `0xDeployer` to be replaced by the address in txs and scripts
})

//import { ACCESS_NODE_URLS } from "../constants/constants";
// import flowJSON from '../../contracts/flow.json';


// const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK

// console.log('app running on network:', flowNetwork);

// config({
//     "flow.network": flowNetwork,
//     "accessNode.api": ACCESS_NODE_URLS[flowNetwork],
//     "discovery.wallet": `https://fcl-discovery.onflow.org/${flowNetwork}/authn`, 
//     "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn",
//     "app.detail.icon": "https://avatars.githubusercontent.com/u/62387156?v=4",
//     "app.detail.title": "Flow Collectibles Portal"
// }).load({ flowJSON })


// config({
//   "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
//   "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
//   "0xFungibleToken": process.env.REACT_APP_FT_CONTRACT,
//   "0xFUSD": process.env.REACT_APP_FUSD_CONTRACT,
//   "0xDappy": process.env.REACT_APP_DAPPY_CONTRACT
// })
