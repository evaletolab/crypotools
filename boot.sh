#!/bin/bash
# https://wiki.debian.org/chroot

#
# simple check
export CHROOT_HOME=/media/chroot
export CHROOT_FS=../chroot.debianfs
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
  dd if=/dev/zero of=$CHROOT_FS bs=1M count=512
  mkfs.ext4 $CHROOT_FS 
  [ ! -f "$CHROOT_HOME/proc/partitions" ] && mount -o loop $CHROOT_FS $CHROOT_HOME
  debootstrap --arch amd64 wheezy $CHROOT_HOME http://httpredir.debian.org/debian
  export HOME=/root
  chroot $CHROOT_HOME apt-get -y --force-yes install git curl  
  chroot $CHROOT_HOME bash -c "curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash"
  chroot $CHROOT_HOME bash -c "cd root;git clone https://github.com/evaletolab/cryptocoins"
  chroot $CHROOT_HOME bash -c "source ~/.profile;nvm install stable;echo PS1='\[\e[1;31m\]\u@\h:\w\${text}$\[\e[m\] '>>~/.bashrc;echo 'cd /root/cryptocoins'>>~/.bashrc"
  umount $CHROOT_HOME
  echo "installation is done! "
  exit;
}



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
chroot $CHROOT_HOME
for i in dev/pts proc dev
do
    umount $CHROOT_HOME/$i
done
umount $CHROOT_HOME

