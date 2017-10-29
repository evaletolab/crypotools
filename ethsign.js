const params = require('minimist')(process.argv.slice(2));
const EthereumTx = require('ethereumjs-tx');
const privateKey = Buffer.from(params.f, 'hex')



const tx = new EthereumTx(null,1);
// So now we have created a blank transaction but Its not quiet valid yet. We
// need to add some things to it. Lets start:
// notice we don't set the `to` field because we are creating a new contract.
tx.nonce = 0;
tx.gasPrice = 100;
tx.gasLimit = 2710;
tx.value = params.a||0;
tx.to=params.t||'';
if(params.d){
    tx.data=params.d;
}

tx.sign(privateKey);

// gas price
// https://www.cryptocompare.com/coins/guides/what-is-the-gas-in-ethereum/

// We have a signed transaction, Now for it to be fully fundable the account that we signed
// it with needs to have a certain amount of wei in to. To see how much this
// account needs we can use the getUpfrontCost() method.
var feeCost = tx.getUpfrontCost()
tx.gas = feeCost
console.log('Total Amount of wei needed:' + feeCost.toString())

// if your wondering how that is caculated it is
// bytes(data length) * 5
// + 500 Default transaction fee
// + gasAmount * gasPrice

// lets serialize the transaction

console.log('---Serialized TX----')
console.log(tx.serialize().toString('hex'))
console.log('--------------------')



console.log('-- ','https://etherscan.io/pushTx')
