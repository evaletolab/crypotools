const params = require('minimist')(process.argv.slice(2));
const Units = require('ethereumjs-units');
const Utils = require('ethjs-util');
const request = require('request');
const BN = require('ethereumjs-util').BN;
const EthereumTx = require('ethereumjs-tx');

//
// https://github.com/ethjs/ethjs-util/blob/master/docs/user-guide.md
// https://github.com/ethereumjs/helpeth

// givin input amount (-a) 
// return max amount amount - gasPrice * gasLimit 
if(params.a&&!params.f&&!params.t){
  var maxa=(params.a+0)-0.00000002*21000;
  console.log('Simple offline function that compute the max amount (without fees)',maxa,'for fees',((params.a+0)-maxa).toPrecision(6));
  process.exit();
  
}

if(!params.f||!params.t||!params.a){
    console.log('usage:','node ethsign.js -f privatekey -t destination -a 0.01');
    process.exit();
}

if(typeof params.t!=='string'||typeof params.f!=='string'){
    console.log('usage: You must strip 0x in your private or public keys ');
    process.exit();
}

if(params.n===undefined){
    console.log('usage : get nonce (-n) value @ https://www.myetherwallet.com/#offline-transaction');
    process.exit();
}

const value=Units.convert(params.a,'ether','wei');
const to=params.t;

//
// gasLimit: 
//  - 21000,0x5208    (0.00042=>0.126$)
//  - 60500,0xEC54    (0.00121=>0.363$) 
//  - 121000,0x1D8A8  (0.00242=>0.726$)
//
// 1 gas = 0.000'000'02 (ether)                                         
// The default gas price is now 0.02 microether which is equivalent to: 20'000'000'000 wei (in code 21'000'000'000 (0x04e3b29200))

const raw={
  "nonce":"0x"+(parseInt(params.n)).toString(16),
  "gasPrice":"0x04e3b29200",
  "gasLimit":"0x5208",
  "to":Utils.isHexPrefixed(to)?to:("0x"+to),
  "value":"0x"+(parseInt(value)).toString(16),
  "data":"",
  "chainId":1
};


const privateKey = Buffer.from(Utils.stripHexPrefix(params.f), 'hex')
const tx=new EthereumTx(raw);
tx.sign(privateKey);

// gas price
// https://www.cryptocompare.com/coins/guides/what-is-the-gas-in-ethereum/

// We have a signed transaction, Now for it to be fully fundable the account that we signed
// it with needs to have a certain amount of wei in to. To see how much this
// account needs we can use the getUpfrontCost() method.
//var feeCost = tx.getUpfrontCost()
//tx.gas = feeCost
//console.log('Total Amount of wei needed:' + feeCost.toString(),'\n')


// if your wondering how that is caculated it is
// bytes(data length) * 5
// + 500 Default transaction fee
// + gasAmount * gasPrice

// lets serialize the transaction
const rawtx=tx.serialize().toString('hex');
console.log('---Serialized TX----')
console.log(rawtx)
console.log('--------------------')



console.log('-- ','https://etherscan.io/pushTx')





