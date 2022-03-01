set -i
export TZ=utc00
rtc -l hw                   # Hardware clock is in local time (instead of UTC)
Dev -n 80 &                 # Maximum number of devices to support (default: 64)    
Dev.ansi -Q -n 10 &         # Start in QNX terminal emulation mode, Maximum number of virtual consoles (default: 1)
reopen //0/dev/con1
echo "Running sysinit.$NODE ..."


Net -d4 -A &                # max number of network drivers (2), don't automatically add netmap entries
/usr/local/bin/Dev32.485 \
  -t14 200,5 208,5 210,5 218,5 220,5 228,5 230,5 238,5 3F8,4 2F8,3 &
Mqueue -d -m -a &           # MQ_READBUF_DYNAMIC, MQ_MULT_NOTIFY, MQ_NOTIFY_ALWAYS
Fsys.floppy &
Pipe &                      # enable piping
#Net.arcnet -l3 -i7 -v &
#sleep 1
Net.rtl -m0050BA4678D0 -x1186 -y1300 -I0 -l1 -v -i11 &
print "1-Net.rtl is ok."
#Net.ether1000 -I0 -l2 & Старая карта
# 21.12.2018
Net.rtl8169 -V 1186 -d 4300 -I 0 -i10 -l2 -v &
print "2-Net.rtl8169 is ok."
#Net.ether82557 -v -l4 &
sleep 1
netmap -f                   # Set the network node mapping table from the default mapfile '/etc/config/netmap'
nameloc -S -Z1 &            # name locator    


if test -r /dev/hd1; then   # FILE exists and the read permission is granted
  echo "Mount seccond hard disk ... \c"
  mount -p /dev/hd1
  if test -r /dev/hd1t77; then
    echo "QNX partition(s) \c"
    mount /dev/hd1t77 /hd1
  else
    echo "non-QNX partition(s) \c"
  fi
  echo "OK."
fi
if test -r /dev/hd2; then
  echo "Mount seccond hard disk ... \c"
  mount -p /dev/hd2
  if test -r /dev/hd2t77; then
    echo "QNX partition(s) \c"
    mount /dev/hd2t77 /hd2
  else
    echo "non-QNX partition(s) \c"
  fi
  echo "OK."
fi
if test -r /dev/cd0; then
  echo "Mount CD disk as /CD/cd0 ... \c"
  Iso9660fsys /CD/cd0=/dev/cd0 &
  echo "OK."
fi
if test -r /dev/fd0; then
  echo "Mount floppy disk ... \c"
  mount /dev/fd0 /A/a
  echo "OK."
fi

if test -r /dev/ram; then
	dinit /dev/ram          # disk initialization
	print "mount /dev/ram /ram"
	mount /dev/ram /ram
	print "cp /home/Web /ram"
	cp -AcLRpn -f /home/Web /ram/home/Web
	print "cp /home/Web_cgi /ram"
	cp -AcLRpn -f /home/Web_cgi /ram/home/Web_cgi
	print "cp /bin /ram"
	cp -AcLRpn -f /bin/ksh /ram/bin/ksh
	cp /bin/awk /ram/bin/
	cp /bin/cat /ram/bin/
	cp /bin/sed /ram/bin/
	cp /bin/grep /ram/bin/
	cp /bin/sort /ram/bin/
	cp /bin/date /ram/bin/
	cp /bin/ls /ram/bin/
	cp /usr/bin/cut /ram/bin/
	cp /usr/bin/paste /ram/bin/
	cp /usr/bin/ctx /ram/bin/
	cp /usr/lib/sqlany50/bin/dbclient /ram/bin/
	cp /usr/local/bin/Sclient /ram/bin/
	cp /usr/local/bin/easy_gif /ram/bin/
	cp /usr/local/bin/unzip /ram/bin/
	cp /usr/local/bin/revtxt /ram/bin/
fi

rm //15/hd1/ddisp/CCM_mnlz72
ln -s //16/dd/CCM_mnlz72 //15/hd1/ddisp/        # Create a symbolic link
print "Reopen //16/dd/CCM_mnlz72"


cyr
clock -b white -f black "+%X" &
rm /usr/local/apache/logs/httpd.pid 2>/dev/null
netstart 0

# Исправил Фролов 04.10.02
if [ -r /home/dbserver/script/.tinit ] ; then   # FILE exists and the read permission is granted
  . /home/dbserver/script/.tinit
else
  tinit -T/dev/con* -t/dev/con1 &   # terminal initialization
                                    # -T Devices to start command when requested
                                    # -t Devices to immediatly start command on
fi
