if [ "$STDLOG" = "" ] ; then
  export STDLOG=".SHUTDOWN.LOG"
fi

echo `date`:  ������ �客�� ��⥬� >> $STDLOG
(echo "\n------------------------------------------------------------------"
echo "|    "`date`":  ������ �客�� ��⥬�       |"
echo '------------------------------------------------------------------'
sin info
cd /home/Web_cgi/
sin.cfg
sin
echo "------------------------------------------------------------------\n"
) >> $STDLOG.sin



	slay -f Sqlclient32
	slay -f sh711
	dbstop n_work
	dbstop bot
#	dbstop uchet
	slay -f cron
	slay -f Mecli
	slay -f Masterguard
	/usr/local/apache/bin/apachectl stop
	echo "��客�� ��⥬� 㬨ࠥ� ���� 5 �"
	sleep 5

