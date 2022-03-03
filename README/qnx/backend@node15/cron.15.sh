#min hour monthday month weekday
20 0 * * * dbbackup -c "uid=dba;pwd=qwe;eng=n_work" -d -y /hd1/backup
#40 1 * * * dbbackup -c "uid=dba;pwd=26102;eng=bot" -d -y /hd1/backup
#00 14  * * * rtsql /home/dbserver/sql/UpdateStat.sys >/dev/con1
#00 05 20 * * rtsql /home/dbserver/sql/Koef.sys >/dev/con1
#30 07 1 * * rtsql /home/dbserver/sql/Birth_Asu.sys >/dev/con1; ctx -ckoi8 <//15/tmp/Birth_Asu.txt|mailx -s'BirthDay' asu32 asu25>/dev/con1
0,5,10,15,20,25,30,35,40,45,50,55 * * * * ksh -a /ram/home/Web_cgi/asutp/.send_ASUTP 2>&1 >/dev/con1 #REVIEW !!!!!!
12 0,10,16,19 * * * ksh -a /ram/home/Web_cgi/today/today.bat 2>&1 >/dev/con1
23 0 * * 0 ksh -a /home/dbserver/script/.delete 2>&1 >/dev/con1
11 1 * * * ksh -a /hd1/arc/bin/.arc 2>&1 >/dev/null
#5,10,15 16 * * 1,2,3,4 echo "05 200 50\n05 200 50\n05 200 50\n05 200 50\n05 200 50\n10 200"|/usr/local/bin/Beep2
#50,55 14 * * 5 echo "05 200 50\n05 200 50\n05 200 50\n05 200 50\n05 200 50\n10 200"|/usr/local/bin/Beep2
#00 15 * * 5 echo "05 200 50\n05 200 50\n05 200 50\n05 200 50\n05 200 50\n10 200"|/usr/local/bin/Beep2
#20,25,30 11 * * * echo "05 120 20\n06 120 20\n05 120 20\n06 120 20\n08 120 20\n10 120"|/usr/local/bin/Beep2
00 08 * * * ksh -a /ram/home/Web_cgi/today/send_argon.bat 2>&1 >>/home/dbserver/Sqlclient.log
#* * * * * /usr/local/bin/php5 /home/dsk/SendToRaport.php

# UpdateStat:   выгружает из bot.dba.view_shtat данные и кладет в /tmp/stat.txt
#               удаляет в n_work таблицу spr_stat и создает новую таблицу из этого файлика


# send_ASUTP:   На 15 минуте запускает /usr/local/bin/kkp 10.2.30.205 10.2.19.215 2 - какая-то херь написанная в 12 году
#               далее смотрится файлик asutp.web
#               первой строкой идет что-то типо //AUTO=1
#               если это AUTO=0 то
#                   для первой строки дата берется по формату %d.%m.%Y %H:%M
#                   для последующих строк дата берется полная %d.%m.%Y %H:%M:%S
#                   какой-то массив заполняется значениями текущей точки unix int
#                   вобщем тут этот задрот пытался что-то сделать дальше..
#               в файле стоит //AUTO=1
#                   набирается дата из ДД по файлу .open_data
#                   к концу файла прибавляется строка s/|...................|/|$DATE|/ где параметр - дата
#                   убивается висящий ftp и файл отправляется на disp:12345@10.2.6.96 по ftp



# today.bat     лезет на 74.ru и забирает данные по курсу валют и погоде.... no comment..