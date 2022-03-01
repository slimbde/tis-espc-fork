if [ "$STDLOG" = "" ] ; then
  export STDLOG=".SHUTDOWN.LOG"
fi

echo `date`:  Смерть цеховой системы >> $STDLOG
(echo "\n------------------------------------------------------------------"
echo "|    "`date`":  Смерть цеховой системы       |"
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
	echo "Цеховая система умирает ждите 5 с"
	sleep 5

