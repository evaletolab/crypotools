# help

## available software
* BTC, electrum 
* LTC, electrum-ltc 
* BCH, electron-cash 
* DASH, electrum-dash 


## restoring wallet based on your private key

  electrum(-dash|-ltc|-cash) restore :

## get balance 

  electrum(-dash|-ltc|-cash) getbalance
 
### sign transaction

  electrum(-dash|-ltc|-cash) payto <address> <amount> (or ! for all)

### sign message

  echo $MESSAGE| electrum signmessage <public-address> -

### display address

  electrum(-dash|-ltc|-cash) listaddresses

# broadcast signed transaction
* ETH, https://etherscan.io/pushTx
* BTC, https://blockchain.info/pushtx
* LTC, https://live.blockcypher.com/ltc/pushtx/
* DASH, https://insight.dash.org/insight/tx/send
* BCH, https://pool.viabtc.com/tools/BCC/broadcast/

