# Manage private cryptocurrencies with 99% safety
The purpose of this project is to propose a simple solution to manage in secure way
your private cryptocurrency accounts (BTC, LTC, DASH, BCH).
This solution is currently designed to be ran on a debian compatible GNU / Linux OS.

## 1. Use a «password manager» to store privates keys(ex. [revelation](https://revelation.olasagasti.info/),[pass](https://www.passwordstore.org/), ...)
All your privates keys must be saved in a offline storage :fire:.
1. Create a dedicated password-manager-file in your `usb device` 
2. Do not save a copy in your computer :fire:!
3. Generate a *strong random password dedicated for wallets applications located in `jailroot`* environnement and store it in your password-manager

```bash
# this commande will generate strong password
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

## 2. Create your offline *cold wallet* 
With all cryptocurrencies, you are the bank, with all the risks! 

1. Mount your USB keys (formated for Linux only :fire:)
1. Create a dedicated password manager file in your usbkey
1. Create papers wallets, print them and **delete all files** (*disable chrome/firefox extensions during this process*)! 
   * bitcoin, https://www.bitaddress.org/ 
   * ethereum, https://www.myetherwallet.com/ 
   * dash, https://paper.dash.org/ 
   * litecoin https://liteaddress.org/ 
2. Saves paper wallets pub/private keys on your password manager 
3. Create offline transaction in secure environnement
4. Push your signed transactions online


## 3. Build a chrooted debian dedicated for transactions (LTE,BTC,DASH,ETHER)
A debiand chrooted OS is the most simple way to sandbox your application and files in a clean environnment. 

**Prerequisite:**
* debian/ubuntu 
* debootstrap, git installed
* copy script in your usb device `cp boot.sh /path/usb/device`


**create filesystem that will contains our debian and all needed content**
You can edit the file `boot.sh` to modify variables on top!

```bash
cd /path/usb/device
sudo sh boot.sh install
```

That will install a minimal debian version with the following softwares:
* electrum 
* electrum-dash
* electrum-ltc
* electron-cash 

> **:fire: You must save the `chroot.debian image with the boot.sh script on your cold storage (USB key)**

## 4. Import wallets from password manager in jailrooted electrum
> It's important here to use a the strong password dedicated (generated) on all electrum applications (>=20 random chars must be placed on your pass manager).

### mount your jailrooted installation
```bash
# 1. place your external usb device
# 2. mount the jailroot 
cd /usb/device;sudo bash boot.sh 
```
![image](https://user-images.githubusercontent.com/1422935/32614813-5be24cee-c56e-11e7-9670-dc5ce2f19213.png)

### using jailrooted wallets (LTC,DASH,BTC,BCH,ETHER)

```bash
# BTC
electrum restore :
# LTC
electrum-ltc restore :
# DASH
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

### push your transactions 
* ETH, https://etherscan.io/pushTx
* BTC, https://blockchain.info/pushtx
* LTC, https://live.blockcypher.com/ltc/pushtx/
* DASH, https://insight.dash.org/insight/tx/send
* BCH, https://pool.viabtc.com/tools/BCC/broadcast/


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


