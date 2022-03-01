#####################################################
# Отправка данных о работе агрегатов ЭСПЦ-6 в АСУТП #
#####################################################

HOME=/ram/home/Web_cgi/asutp/
MY_BODY='asutp.web'
#MACHINE="10.2.8.210"
MACHINE="asutp.mechel.com"

FILE="09a"`date '+%d_%H.%M'`
DATE=`date +'%Y-%m-%d %H:%M:%S'`
# Время отстоя перед повторной отправкой данных
SECOND=1200

cd $HOME

if [ `date +'%M'` = "15" ]; then
/usr/local/bin/kkp 10.2.30.205 10.2.19.215 2
fi


#Тело батника

STATUS=`grep "AUTO=0" $MY_BODY`


#Проверка секунд отстоя
if [ "$STATUS" != "" ]; then
STATUS=`(tail -n1 $MY_BODY;date +'%d.%m.%Y %H:%M:%S')|awk -F'|' '
{
if (NR==1)
DATE=substr($2,1,16)

else
DATE=$0
SEC[NR]=substr(DATE,18,2) + substr(DATE,15,2)*60 + substr(DATE,12,2)*60*60 + substr(DATE,1 ,2)*60*60*24 + substr(DATE,4 ,2)*60*60*24*31 + substr(DATE,7 ,4)*60*60*24*31*12
if ((NR==2) && (SEC[2]-SEC[1])<=SECOND)
print "Не отправлять"
}' SECOND=$SECOND `
fi


if [ "$STATUS" = "" ]; then
	(echo '//AUTO=1';
	.open_data|awk -F '|' -f DSPa.awk)>$MY_BODY         # -f program file -F separator
fi



cat $MY_BODY|tail +1|sed -e "s/|...................|/|$DATE|/">$FILE
#Отправка данных по FTP
slay -f ftp
/usr/ucb/ftp -i $MACHINE 2>&1 <<MY_LOGIN
put $FILE
quit
MY_LOGIN

#Для удаления файлов типа 09*** раскомментарить
rm $FILE

