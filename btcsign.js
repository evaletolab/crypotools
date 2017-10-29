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
const request = require('request');
const params  = require('minimist')(process.argv.slice(2));
const satoshis= 100000000;
var tx = new bitcoin.TransactionBuilder()

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
    console.log('usage:','node btcsign.js -f privatekey -t destination -a 0.01');
    process.exit();
}

// Initialize a private key using WIF
// var privateKeyWIF = 'L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy';
// https://github.com/bitcoinjs/bitcoinjs-lib/blob/9bae30d1121a9d382f2f461fad0194a0e97dfd1e/test/integration/addresses.js
var pk = new Buffer(params.f, 'hex')
var keyPair = bitcoin.ECPair.fromWIF(wif.encode(128, pk, true));

//
// get avilable balance from source
if(params.b){
  request.get({url: "https://blockchain.info/fr/balance?active=" + keyPair.getAddress()}, function (error, response, body) {
    try{
      body=JSON.parse(body);  
    }catch(e){
      console.log(body)
      process.exit()  
    }
    Object.keys(body).forEach(k=>{
      console.log('-- ',k,body[k].final_balance)
      console.log('    balance',body[k].final_balance,' n_tx',body[k].n_tx)
    })
    
  });
  
}
//
// sign transaction
else
request.get({url: "https://blockchain.info/fr/unspent?active=" + keyPair.getAddress()}, function (error, response, body) {
  try{
    body=JSON.parse(body);  
  }catch(e){
    console.log(body)
    process.exit()  
  }
  body.unspent_outputs=body.unspent_outputs.filter(x=>x.confirmations>0)
  //console.log(body.unspent_outputs)
  
  //let { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate)
  //var coinselect=coinSelect(unspent.unspent_outputs,[{address:params.t,value:params.a}],50);
  //console.log('---',coinselect.inputs)
  
  // https://blockchain.info/fr/balance?active=16vtTE9JTqjV7CN3kyMLBogvpLMuPxF4qD
  // https://blockchain.info/fr/unspent?active=16vtTE9JTqjV7CN3kyMLBogvpLMuPxF4qD
  // Add the input (who is paying):
  // [previous transaction hash, index of the output to use]  
  // An unspent output is simply an output of a transaction which isn't yet an input of another transaction.
  var unspent=body.unspent_outputs[body.unspent_outputs.length-1];
  tx.addInput(unspent.tx_hash_big_endian, unspent.value|0);  
  //body.unspent_outputs.forEach(unspent=>{
  //  console.log('unspent ',unspent.tx_hash_big_endian, (unspent.value|0)/satoshis,'\n\n')
  //})

  // Add the output (who to pay to):
  // [payee's address, amount in satoshis (* 100'000'000)]
  tx.addOutput(params.t, parseFloat(params.a)* satoshis)


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
  console.log('-- txid  ',unspent.tx_hash_big_endian,(unspent.value|0)/satoshis,'\n')


  console.log('---Serialized TX----')
  console.log(tx.build().toHex())
  console.log('--------------------\n')


  // You could now push the transaction onto the Bitcoin network manually
  // (see https://blockchain.info/pushtx)
  console.log('-- ','https://blockchain.info/pushtx')
  console.log('-- ','https://blockchain.info/tx/',unspent.tx_hash_big_endian)
});

