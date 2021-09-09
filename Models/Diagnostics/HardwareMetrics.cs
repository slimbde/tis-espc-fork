using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;


namespace TIS_ESPC_FORK.Models.Diagnostics
{
    public class HardwareMetrics
    {
        static Dictionary<string, string> cpuPercentage;
        static Dictionary<string, string> memoryUsage;
        static Dictionary<string, string> drives;
        System.Timers.Timer timer;


        public int TimerDelay
        {
            set
            {
                this.timer.Interval = value;
                this.TimerDelay = value;
            }
            get
            {
                return this.TimerDelay;
            }
        }

        public Dictionary<string, string> CpuPercentage { get { return cpuPercentage; } }
        public Dictionary<string, string> MemoryUsage { get { return cpuPercentage; } }
        public Dictionary<string, string> Drives { get { return drives; } }

        public HardwareMetrics()
        {
            this.timer = new System.Timers.Timer();
            this.TimerDelay = 10000;
            this.timer.Elapsed += new System.Timers.ElapsedEventHandler((x, y) => updateInfo());
        }

        public HardwareMetrics(bool watching)
        {
            this.timer = new System.Timers.Timer();
            this.TimerDelay = 10000;
            this.timer.Elapsed += new System.Timers.ElapsedEventHandler((x, y) => updateInfo());
            this.timer.Enabled = watching;
        }

        public HardwareMetrics(bool watching, int TimerDelay)
        {
            this.timer = new System.Timers.Timer();
            this.TimerDelay = TimerDelay;
            this.timer.Elapsed += new System.Timers.ElapsedEventHandler((x, y) => updateInfo());
            this.timer.Enabled = watching;
        }

        public void StartWatch()
        {
            if (this.timer.Enabled) return;
            this.timer.Enabled = true;
        }

        public void StopWatch()
        {
            if (this.timer.Enabled)
                this.timer.Enabled = false;
        }

        public static Dictionary<string, string> getDriveInfo()
        {
            Dictionary<string, string> info = new Dictionary<string, string>();
            DriveInfo[] disks = getDrives();
            for (int i = 0; i < disks.Length; i++)
            {
                try // cdrom throws
                {
                    DriveInfo currentDrive = disks.ElementAt(i);
                    info["Disk" + i + " name"] = currentDrive.Name;
                    info["Disk" + i + " total space"] = currentDrive.TotalSize.ToString() + " bytes";
                    info["Disk" + i + " avaiable free space"] = currentDrive.AvailableFreeSpace.ToString() + " bytes";
                }
                catch (Exception) { }
            }
            return info;
        }

        public static Dictionary<string, string> getMemoryInfo()
        {
            Dictionary<string, string> info = new Dictionary<string, string>();
            info["RAM usage"] = Math.Round(getRamUsage()).ToString() + " bytes";
            return info;
        }

        public static Dictionary<string, string> getCpuInfo()
        {
            Dictionary<string, string> info = new Dictionary<string, string>();
            float percenatage = getCpuUsage();
            info["CPU usage"] = Math.Round(percenatage).ToString();
            return info;
        }

        public static Dictionary<string, string> getSpreadInfo()
        {
            updateInfo();

            Dictionary<string, string> info = new Dictionary<string, string>();
            info = info.Concat(drives).Concat(memoryUsage).Concat(cpuPercentage).ToDictionary(x => x.Key, x => x.Value);

            return info;
        }




        ////////////////////////////////// AUXILIARIES
        static DriveInfo[] getDrives()
        {
            DriveInfo[] disks;
            disks = DriveInfo.GetDrives();
            return disks;
        }

        static void updateInfo()
        {
            drives = getDriveInfo();
            memoryUsage = getMemoryInfo();
            cpuPercentage = getCpuInfo();
        }

        static float getCpuUsage()
        {
            PerformanceCounter cpuUsage = new System.Diagnostics.PerformanceCounter();
            cpuUsage.CategoryName = "Processor";
            cpuUsage.CounterName = "% Processor Time";
            cpuUsage.InstanceName = "_Total";

            try
            {
                float avg = cpuUsage.NextValue();
                for (int i = 0; i < 4; i++)
                {
                    avg += cpuUsage.NextValue();
                    avg /= 2;
                }
                return avg;
            }
            catch (Exception) { return 0; }
        }

        static float getRamUsage() => GC.GetTotalMemory(false);
    }
}