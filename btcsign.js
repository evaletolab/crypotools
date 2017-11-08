//
// howto:
// node btcsign.js -f privatekey -t destination -a amount (satoshis!!)

//
// npm install bitcoinjs-lib coinselect
//
// transactions:
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/9bae30d1121a9d382f2f461fad0194a0e97dfd1e/test/integration/transactions.js
// https://en.bitcoin.it/wiki/Transaction#Input

const bitcoin = require('bitcoinjs-lib');
const wif = require('wif');
const bs58check = require('bs58check');
const coinselectConsructor= require('coinselect')	
const request = require('request');
const params  = require('minimist')(process.argv.slice(2));
const satoshis= 100000000;

const networks={
  litecoin:{ /*txid,+output_no,+value,script_asm,script_hex,confirmations, missing script, and */
    balance:'https://chain.so/api/v2/get_address_balance/LTC/',
    unspent:'https://chain.so/api/v2/get_tx_unspent/LTC/',
    txmap:(tx)=>{
      return {txid:tx.txid.split("").reverse().join(""),value:(tx.value|0)*satoshis,confirmations:tx.confirmations,script:tx.script_hex,output_n:tx.output_no};
    },
    proto: bitcoin.networks.litecoin,
    label:'ltc'
  },
  dash:{
    balance:'https://chain.so/api/v2/get_address_balance/DASH/',
    unspent:'https://chain.so/api/v2/get_tx_unspent/DASH/',
    proto: bitcoin.networks.dash,
    label:'dash'
  },
  bitcoin:{
    balance:'https://chain.so/api/v2/get_address_balance/BTC/',
    unspent:'https://chain.so/api/v2/get_tx_unspent/BTC/',
    txmap:(tx)=>{
      return {txid:tx.txid.split("").reverse().join(""),value:tx.value*satoshis,confirmations:tx.confirmations,script:tx.script_hex,output_n:tx.output_no};
    },
    proto: bitcoin.networks.bitcoin,
    label:'btc'
  },
  bitcash:{
    balance:'https://chain.so/api/v2/get_address_balance/BCH/',
    unspent:'https://chain.so/api/v2/get_tx_unspent/BCH/',
    txmap:(tx)=>{
      return {txid:tx.txid.split("").reverse().join(""),value:tx.value*satoshis,confirmations:tx.confirmations,script:tx.script_hex,output_n:tx.output_no};
    },
    proto: bitcoin.networks.bitcoin,
    label:'bch'
  }
}
const network=networks[params.n||'bitcoin'];
const tx = new bitcoin.TransactionBuilder(network.proto);

//
// generate address and exit
if(params.g){
  var keyPair = bitcoin.ECPair.makeRandom()
  var address = keyPair.getAddress();
  var pk=wif.decode(keyPair.toWIF()).privateKey.toString('hex');
  console.log('-- public ',address);  
  console.log('-- private',pk);
  process.exit();
}

if(!params.f||!params.t||!params.a){
    console.log('usage:','node btcsign.js -f privatekey -t destination -a 0.01  -n *bitcoin|litecoin|dash');
    process.exit();
}

// Initialize a private key using WIF
// var privateKeyWIF = 'L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy';
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/9bae30d1121a9d382f2f461fad0194a0e97dfd1e/test/integration/addresses.js
var isWif= bs58check.decodeUnsafe(params.f);
var keyPair;
if(isWif){
  keyPair = bitcoin.ECPair.fromWIF(params.f,network.proto);
}else{
  var pk = new Buffer(params.f,'hex')
  keyPair = bitcoin.ECPair.fromWIF(wif.encode(128, pk, true));
}

//
// get avilable balance from source
if(params.b){
  request.get({url: network.balance + keyPair.getAddress()}, function (error, response, body) {
    try{
      body=JSON.parse(body);  
    }catch(e){
      console.log(body)
      process.exit()  
    }
    if(body.data){
      return console.log(body.data.network,'balance (confirmed)',body.data.confirmed_balance,' unconfirmed',body.data.unconfirmed_balance)    
    }
    
    //
    // deprecated
    Object.keys(body).forEach(k=>{
      console.log('-- ',k,body[k].final_balance)
      console.log('    balance',body[k].final_balance,' n_tx',body[k].n_tx)
    })
    
  });
  
}
//
// sign transaction
else
request.get({url: network.unspent + keyPair.getAddress()}, function (error, response, body) {
  try{
    body=JSON.parse(body);  
    console.log('----',body.data)
    if(body.data&&body.data.txs){
      body.unspent_outputs=body.data.txs;  
    }
    body.unspent_outputs=body.unspent_outputs.map(network.txmap)
  }catch(e){
    console.log(e,body)
    process.exit()  
  }
  
  if(process.env.HISTFILE){
    console.log('unset HISTFILE before using this script');
    process.exit();
  }
  
  
  // https://blockchain.info/fr/balance?active=16vtTE9JTqjV7CN3kyMLBogvpLMuPxF4qD
  // https://blockchain.info/fr/unspent?active=16vtTE9JTqjV7CN3kyMLBogvpLMuPxF4qD
  // Add the input (who is paying):
  // [previous transaction hash, index of the output to use]  
  // index of publickey that belongs to this transaction
  body.unspent_outputs=body.unspent_outputs.filter(x=>x.confirmations>0);
  const amount=parseFloat(params.a)* satoshis;
  let { inputs, outputs, fee } = coinselectConsructor(body.unspent_outputs, [{
    address:params.t,
    value:amount
   }], 42);


  inputs.forEach(input => tx.addInput(input.txid, input.output_n))

  // Add the output (who to pay to):
  // [payee's address, amount in satoshis (* 100'000'000)]
  // https://en.bitcoin.it/wiki/Transaction_fees#Sending
  //tx.addOutput(params.t, amount)
  //tx.addOutput(keyPair.getAddress(), unspent.value-fee)
  outputs.forEach(output => tx.addOutput(output.address||keyPair.getAddress(), output.value))

  
  //
  // 40 bytes std transaction custom content
  // var ret = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN, data])
  // tx.addOutput(ret, 0)


  // Sign the first input with the new key
  tx.sign(0, keyPair)

  // Print transaction serialized as hex
  console.log('')
  console.log('-- From  ',keyPair.getAddress())
  console.log('-- to    ',params.t)
  console.log('-- amount',params.a,'(btc) =',parseFloat(params.a)* satoshis,'Satoshis')
  console.log('-- txid  ',inputs[0].txid,inputs[0].value,fee,'fees \n')


  console.log('---Serialized TX----')
  console.log(tx.build().toHex().toString())
  console.log('--------------------\n')


  // You could now push the transaction onto the Bitcoin network manually
  // (see https://blockchain.info/pushtx)
  console.log('-- ','https://blockchain.info/pushtx')
  console.log('-- ','https://blockchain.info/tx/'+inputs[0].txid)
  console.log('-- ','https://blockchain.info/decode-tx');
});

