export PATH=$PATH:$HOME/bin:$HOME/script:/usr/local/apache/bin
export LOGDIR=$HOME/log
export STDLOG=$LOGDIR/����⨪�.log
.SETLINES                               # ����ࠨ���� ����㠫�� serial ports 
.DB.stop                                # 㡨���� ��⥬�
.DB.sys                                 # ��������� ��⥬�
.tinit                                  # ���樠������ �ନ�����
ezfm
#exec /bin/ksh -a
