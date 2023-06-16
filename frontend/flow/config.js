import { config } from "@onflow/fcl";

config({
  "flow.network": "testnet",
  "app.detail.icon": "https://i.imgur.com/ux3lYB9.png",
  "accessNode.api": "https://rest-testnet.onflow.org", // Testnet Access Node
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet Wallet Discovery
});