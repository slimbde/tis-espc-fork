if [ "$STDLOG" = "" ] ; then
  export STDLOG=".STARTUP.LOG"
fi
echo `date`:  ����� �客�� ��⥬� >> $STDLOG
.SETLINES
# ��ࢥ� dbstart n_work
	dbsrv50 -gn20 -gs96K -gp4096 -c40M -x "tcpip{MyIP=192.168.9.215},qnx" -o /dev/mqueue/Message.log /home/dbserver/n_work.db -q&
# ��ࢥ� bot - "�����"
	sleep 4
	dbsrv50 -gs56K -c4M -x "tcpip{to=2;Broadcast=192.168.9.255;MyIp=192.168.9.215;Port=1501},qnx" -C1M /home/bot/db/bot.db -q & 
	sleep 2
# ��ࢥ� uchet - "��壠���᪨� ���"
#	dbsrv50 -m -x "tcpip{to=2;Broadcast=192.168.9.255;MyIp=192.168.9.215;Port=1500},qnx" -c1M //15//home/uchet/db/uchet.db -q &
# ����� �����⮢
    .Sqlclient.start
	stty +flush </dev/ser3
echo ��ࢥ� �ᯥ���� ᮧ���� 䠩� Message.log
    sleep 5
	on -t /dev/con9 sh711 -q1 -p12 -V -t2 -l/hd1/docs/energo/e &
#echo ����� �711 �� 9 ���᮫�, �� ������᪥ ������� � ��ୠ� � sh711.bat
	chmod o+w //15/dev/mqueue/Message.log
# ��ନ� /dev/ser11
    Mecli -VS -i/dev/mqueue/Message.log -o$HOME/Sqlclient.log &
	echo "��客�� ��⥬� ����㦥��"
	/usr/local/apache/bin/apachectl start
#�ࠩ��� UPS MasterGuard
#	.UPS
# ��ࢥ� ᨭ�஭���樨 (UNIX) 
# ����᪠�� ����஢���� ���� ����� ���� � 00:00
	.cron_start
	
