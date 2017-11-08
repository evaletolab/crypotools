#!/bin/bash
# https://wiki.debian.org/chroot

#
# simple check
export CHROOT_HOME=/media/chroot
export CHROOT_FS=./chroot.debianfs
export USER=crypto
export LC_ALL=C
export UBUNTUREL=xenial #$(lsb_release -sc)
WIM=$(whoami)
[ "$WIM" = "root" ] || {
  echo "not sudo, exit..."
  exit;
}


[ -z "$CHROOT_HOME" ] && {
  echo "chroot home is not define"
  exit;
}

#
# install
[ "$1" = "install" ] && {
  [ -f "$CHROOT_HOME/proc/partitions" ] && {
    echo "Already mounted chroot"
    exit;
  }
  
  which debootstrap 1>/dev/null ||{
    echo "install debootstrap before to run the script"
    exit;
  
  }
  
  [ ! -f "$CHROOT_FS" ] || {
    echo "one chroot filesystem already exist: $CHROOT_FS"
    exit;
  }
  echo "install chroot"
  dd if=/dev/zero of=$CHROOT_FS bs=1M count=1500
  mkfs.ext4 $CHROOT_FS 
  [ ! -f "$CHROOT_HOME/proc/partitions" ] && mount -o loop $CHROOT_FS $CHROOT_HOME
  
  #debian => wheezy, http://httpredir.debian.org/debian
  debootstrap --include=git,cowsay,curl,libusb-1.0-0-dev,libudev-dev --arch amd64 $UBUNTUREL  $CHROOT_HOME http://archive.ubuntu.com/ubuntu/

  # copying script inside protected chroot
  export HOME=/root SUDO_UID=0 SUDO_USER=root


  chroot $CHROOT_HOME bash -c 'echo "deb http://archive.ubuntu.com/ubuntu $UBUNTUREL universe">>/etc/apt/sources.list'
  chroot $CHROOT_HOME apt-get -y --force-yes update
  chroot $CHROOT_HOME apt-get -y --force-yes install python python-pip python3-pip
  # update-alternatives --install /usr/bin/python python /usr/bin/python3.4 2

  chroot $CHROOT_HOME bash -c "useradd -m -s /bin/bash -d /home/$USER $USER;passwd -d $USER;add-apt-repository universe;pip2 install --upgrade pip"
  chroot $CHROOT_HOME bash -c "pip3 install https://download.electrum.org/3.0.1/Electrum-3.0.1.tar.gz"
  chroot $CHROOT_HOME bash -c "pip2 install https://electrum-ltc.org/download/Electrum-LTC-2.9.3.1.tar.gz"
  chroot $CHROOT_HOME bash -c "pip2 install https://electrum.dash.org/download/2.6.4/electrum-dash-2.6.4.tar.gz"
  chroot $CHROOT_HOME bash -c "pip2 install https://electroncash.org/downloads/2.9.3/win-linux/Electron-Cash-2.9.3.tar.gz"


  chroot $CHROOT_HOME su -l $USER -c "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash"
  chroot $CHROOT_HOME su -l $USER -c "echo PS1=\'\\\[\\\e[1\;31m\\\]\\\u@\\\h\:\\\w\${text}$\\\[\\\e[m\\\] \'>>~/.bashrc"
  chroot $CHROOT_HOME su -l $USER -c "echo cowsay 'welcome!'>>~/.bashrc"
#  chroot $CHROOT_HOME su -l $USER -c "source .profile;nvm install stable;npm install"  
  umount $CHROOT_HOME
  echo "installation is done! "
  exit;
}

#/usr/bin/sudo /usr/sbin/chroot /usr/local/jail /bin/su $USER "$@"



#
# default usage
[ ! -f "$CHROOT_HOME/proc/partitions" ] && {
  mount -o loop $CHROOT_FS $CHROOT_HOME
  mount --bind /dev $CHROOT_HOME/dev
  mount --bind /proc $CHROOT_HOME/proc
#  mount -t sysfs $CHROOT_HOME/sys
  mount -t devpts none $CHROOT_HOME/dev/pts

  #sudo mount --bind /proc $CHROOT_HOME/proc
}

export HOME=/root
export HISTFILE=/dev/null
chroot $CHROOT_HOME su -l $USER 
for i in dev/pts proc dev
do
    umount $CHROOT_HOME/$i
done
umount $CHROOT_HOME

