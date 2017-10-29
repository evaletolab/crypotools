# 99% Secure to manage private bitcoin and ethereum

Le but de ce projet est de proposer une solution pour pouvoir gérer avec une 
assez bonne sécurité des comptes privés de cryptomonnaies. 
Cette solution fonctionne pour l'instant sur un système GNU/Linux compatible debian .

## Utiliser un *Password Manager* ([revelation](https://revelation.olasagasti.info/),[pass](https://www.passwordstore.org/),... )
Vos clés de vos cryptomonnaies doivent être isolées de vos affaires courrantes.
1. Créer un fichier propre pour gérer vos clés privés.
2. Le fichier doit toujours être sur un support offline (par exemple des clés USB).


## Gérer vos *cold wallet* privés et sécurisés
Pour toutes les cryptos monnaies, la banque c'est vous! C'est donc une nouvelle responssabilité car à la moindre erreur, vous perdez vos comptes et tout ce qu'il y a avec! Je vous propose une manière assez simple qui vous permettra de gérer vos comptes sans tomber dans les pièges suivants:
* le crash de votre disque dur est une bonne manière de tout perdre, même les 100 btc qu'on vous avait offert. 
* un virus pourait avoir comme objectif de chercher silencieusement des clés privés dans votre disque dur, le vilain.
* en utilisant de multiples couches de cryptage et mots de passes, c'est facile de perdre un des éléments, et tout est perdu. 


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

* debian/ubuntu OS host
* debootstrap git should be installed
* change directory in $HOME/Documents/crypto  
* install files git clone https://github.com/evaletolab/cryptocoins


## create filesystem that will contains our debian and all needed content
You can edit the file `boot.sh` to modify variables on top!

  `sudo sh boot.sh install`


# More security, avoid history & network
Simple security actions

* You can stop a part of the network `service named stop`
* Desactivate history of you commands `export HISTFILE=/dev/null`



# push your offline transactions 
* https://etherscan.io/pushTx
* https://blockchain.info/pushtx
* 
node ethsign.js -f e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109 -t 0000000000000000000000000000000000000000 -a 0.001
node btcsign.js -f c8eae8b7f1d22ab5665c5799c3fb5b7ef4b71e02daa663ec8dafa373dc05db92 -t 1evXk3oLDPdi7gfrvfdDnCSSAYuxscLWV -a 1



