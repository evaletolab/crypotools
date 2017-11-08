# 99% Secure to manage private bitcoin and ethereum
Le but de ce projet est de proposer une solution simple pour pouvoir gérer avec sécurité 
les principaux comptes privés de cryptomonnaies (BTC,LTC,DASH,BCH). 
Cette solution fonctionne pour l'instant sur un système GNU/Linux compatible debian.

## Installation & Usage 
1. create safe offline printed wallets with a backup in external (USB) device 
2. install our chrooted debian OS in your current OS 
3. use offline scripts to create transaction for ether, bitcoin, litecoin, dash or bitcoin cash

## Utiliser un «Password Manager» (ex. [revelation](https://revelation.olasagasti.info/),[pass](https://www.passwordstore.org/), autres ... )
Vos clés de vos cryptomonnaies doivent être isolées de vos affaires courrantes.
1. Créer un fichier propre pour gérer vos clés privés.
2. Le fichier doit toujours être sur un support offline (par exemple des clés USB).
3. Generate a *strong password dedicated for electrum on the `chroot`* environnement

```bash
# this commande will help
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```


## Create your offline *cold wallet* 
Pour toutes les cryptos monnaies, la banque c'est vous! C'est donc une nouvelle 
liberté individuelle mais à la moindre erreur, vous perdez tout :fire:! 

0. Mount your USB keys
1. Create password manager file 
1. Create papers wallets, print them and delete all files (note to disable chrome/firefox extensions)! 
  1. bitcoin, https://www.bitaddress.org/ 
  2. ethereum, https://www.myetherwallet.com/ 
  3. dash, https://paper.dash.org/ 
  4. litecoin https://liteaddress.org/ 
2. Saves paper wallets pub/private keys on your password manager 
3. Create offline transaction in secure environnement


# create a chrooted debian dedicated for transactions (LTE,BTC,DASH,ETHER)
A debiand chrooted OS is the most simple way to sandbox your application and files in a clean environnment. 

**Prerequisite:**
* debian/ubuntu 
* debootstrap, git installed


## create filesystem that will contains our debian and all needed content
You can edit the file `boot.sh` to modify variables on top!

  `sudo sh boot.sh install`

That will install a minimal debian version with the following softwares:
* electrum 
* electrum-dash
* electrum-ltc
* electron-cash 

> **You must save the `chroot.debian image with the boot.sh script on your cold storage (USB key)**

## import wallets from password manager in electrum
It's important here to use a very strong password dedicated on all electrum applications (>=20 random chars must be placed on your pass manager).

### using jailrooted wallets (LTC,DASH,BTC,BCH,ETHER)
```bash
# BTC
electrum restore :
# BTC
electrum-ltc restore :
# LTC
electrum-dash restore :
# BCH
electron-cash restore :
```

### get balance 

```bash
electrum getbalance

```
 
### sign transaction

```bash
electrum(-dash|-ltc|-cash) payto <address> <amount> (or ! for all)
```

## push your offline transactions 
* https://etherscan.io/pushTx
* https://blockchain.info/pushtx
* https://live.blockcypher.com/ltc/pushtx/
* https://insight.dash.org/insight/tx/send
* https://pool.viabtc.com/tools/BCC/broadcast/


### case of ethereum 

```
nvm install stable
git clone https://github.com/evaletolab/crypotools
cd crypotools && npm install
node ethsign.js -f <priv> -t <pub> -a 0.001
```

## TODO & links

* limit external hosts in jailrooted image
* limit chroot directory access only for root users
* https://live.blockcypher.com/ltc/decodetx/
* [verifying transactions](https://coinb.in/#verify)
* [testing your segwit transaction on segnet](http://n.bitcoin.ninja/checktx)


