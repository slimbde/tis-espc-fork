DIR=/etc/config/netsetup

echo "Welcome, $LOGNAME !"

LIBROOT=/usr/local

export MYINCLUDE=$LIBROOT/include
export INCLUDE=$INCLUDE:$MYINCLUDE
export MYLIB=$LIBROOT/lib
export LIB=$LIB:$MYLIB
export BIN=$HOME/bin
export PATH=$PATH:$BIN
export SQLCLIENT="dbclient -x qnx"
export KBD=ru_RU_101
# export WINGRAFX='gr.scitech -g1024x768'

case $(tty) in
  */dev/con*)
    # mqc
    ezfm
    ;;
  *)
    #echo "Starting on serial, pseudo tty network port, TERM=vt100 ..."
    #unset TERM
    #export TERM=vt100
    stty load
	ezfm
    ;;
esac
