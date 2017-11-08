# 99% Secure to manage private bitcoin and ethereum

Le but de ce projet est de proposer une solution pour pouvoir gérer avec une 
assez bonne sécurité des comptes privés de cryptomonnaies. 
Cette solution fonctionne pour l'instant sur un système GNU/Linux compatible debian .

## Installation & Usage 
1. create safe offline wallets with backup in external (USB) device 
2. install our chrooted debian OS in your current OS 
3. use offline scripts to transfer ether, bitcoins, litecoins, or dash

## Utiliser un «Password Manager» (ex. [revelation](https://revelation.olasagasti.info/),[pass](https://www.passwordstore.org/), autres ... )
Vos clés de vos cryptomonnaies doivent être isolées de vos affaires courrantes.
1. Créer un fichier propre pour gérer vos clés privés.
2. Le fichier doit toujours être sur un support offline (par exemple des clés USB).


## Gérer vos *Cold Wallet* privés et sécurisés
Avec toutes les cryptos monnaies, la banque c'est vous! C'est donc une nouvelle responssabilité pour vous car à la moindre erreur, vous perdez vos comptes et tout ce qu'il y a avec :fire:, et c'est sans assurance! Je vous propose une manière assez simple qui vous permettra de gérer vos comptes sans tomber dans les pièges suivants:
* le crash de votre disque dur est une bonne manière de tout perdre, adieux aux 100 btc qu'on vous avait offert. 
* un virus pourait avoir comme objectif de chercher silencieusement des clés privés dans votre disque dur, le vilain.
* en utilisant de multiples couches de cryptage et mots de passes, c'est facile de perdre un des éléments, et adieux ... 


Je propose une solution qui selon moi, équilibre la balance sécurité et facilité :
1. Créer des comptes a imprimmer impérativement sur papier (attention à désactiver les extensions chrome/firefox pendant cette étape)! 
  1. https://www.bitaddress.org/ pour bitcoin
  2. https://www.myetherwallet.com/ pour ethereum
  3. https://paper.dash.org/ pour dash
  4. https://liteaddress.org/ pour litecoin
2. Enregistrer dans votre password manager dédiés vos clés privés et publiques. Utiliser un mot de passe unique pour le fichier. Le fichier du password manager doit être sur une clé USB
3. Utiliser les programmes de transactions dans un environnement protégé 


# create a chrooted debian dedicated for transactions (LTE,BTC,DASH,ETHER)
A debiand chrooted OS is the most simple way to sandbox your application and files in a clean environnment. Prerequisite:

**Prerequisite:**
* debian/ubuntu 
* debootstrap, git installed

```bash
mkdir Documents/crypto
cd Documents/crypto
git clone https://github.com/evaletolab/cryptocoins
cd cryptocoins
```


## create filesystem that will contains our debian and all needed content
You can edit the file `boot.sh` to modify variables on top!

  `sudo sh boot.sh install`

## sign your transaction

```bash
sudo sh boot.sh
cd cryptocoins
# ethereum params: -from -to -amount
node ethsign.js -f <priv> -t <pub> -a 0.001
# bitcoin params: -from -to -amount -balance
node btcsign.js -b <pub> # get balance
node btcsign.js -f <priv> -t <pub> -a 1

```

## push your offline transactions 
* https://etherscan.io/pushTx
* https://blockchain.info/pushtx
* https://live.blockcypher.com/ltc/pushtx/
* https://insight.dash.org/insight/tx/send

* https://live.blockcypher.com/ltc/decodetx/
* [verifying transactions](https://coinb.in/#verify)
* [testing your segwit transaction on segnet](http://n.bitcoin.ninja/checktx)


