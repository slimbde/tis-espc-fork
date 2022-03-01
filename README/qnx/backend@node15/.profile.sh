export PATH=$PATH:$HOME/bin:$HOME/script:/usr/local/apache/bin
export LOGDIR=$HOME/log
export STDLOG=$LOGDIR/Статистика.log
.SETLINES                               # настраивает виртуальные serial ports 
.DB.stop                                # убивает систему
.DB.sys                                 # поднимает систему
.tinit                                  # инициализация терминалов
ezfm
#exec /bin/ksh -a
