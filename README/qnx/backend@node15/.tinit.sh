#!/bin/ksh

# Добавлен ppp на загрузку сыпучих
#   192.168.9.18, zserv.espc6.mechel.com
#   192.168.9.201, zcont.espc6.mechel.com
# Фролов

slay -f tinit pppd login
sleep 1

# Может, добавить к tinit-у '-Tcon1' ?

stty baud=28600 </dev/ser1
#stty baud=57600  </dev/ser2

if [ "$LOGNAME" = "" ] ; then
  echo $(basename $0): Load from sysinit
  tinit -T /dev/con[2-4] -t /dev/con1 &
else
  echo $(basename $0): Start by $LOGNAME
  tinit -T /dev/con[2-4] -T /dev/con1 &
#/usr/ucb/pppd /dev/ser2 57600 proxyarp 192.168.9.215:192.168.9.35
fi

#-c "/bin/login energetic" -Tser4 \
/usr/ucb/pppd /dev/ser1 28600 proxyarp 192.168.9.215:192.168.9.18 &

tinit \
-c "/usr/ucb/pppd 28600 proxyarp 192.168.9.215:192.168.9.18" -m20 -Tser1 &      # запуск демон протокола точка-точка
#-c "/usr/ucb/pppd 57600 proxyarp 192.168.9.215:192.168.9.35"  -m20 -tser2 &


#-c "/bin/login OEL-4" -Tser1 \

# Пока ОЭЛ-4 не использует /dev/ser1
# Сейчас сделано по 'слипу'на ser10
#-c "/usr/ucb/pppd 28800 192.168.201.9:192.168.201.10 \
#    netmask 255.255.255.252 defaultroute debug" -tser10 &
#-c "/usr/ucb/pppd 37200 proxyarp 192.168.9.215:192.168.9.8" -tser9 \

