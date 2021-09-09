using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Web;

namespace TIS_ESPC_FORK.Models.Diagnostics
{
    public class SpecificImpersonate : IDisposable
    {
        public const int LOGON32_LOGON_INTERACTIVE = 9;
        public const int LOGON32_PROVIDER_DEFAULT = 0;

        private IntPtr token = IntPtr.Zero;

        WindowsImpersonationContext impersonationContext;

        [DllImport("advapi32.dll")]
        public static extern int LogonUserA(String lpszUserName,
        String lpszDomain,
        String lpszPassword,
        int dwLogonType,
        int dwLogonProvider,
        ref IntPtr phToken);
        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern int DuplicateToken(IntPtr hToken,
        int impersonationLevel,
        ref IntPtr hNewToken);

        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern bool RevertToSelf();


        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        public static extern bool CloseHandle(IntPtr handle);
        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        public static extern int GetLastError();

        private bool impersonateValidUser(String userName, String domain, String password)
        {
            WindowsIdentity tempWindowsIdentity;

            IntPtr tokenDuplicate = IntPtr.Zero;

            if (!RevertToSelf()) throw new Exception("Dll error: " + GetLastError().ToString());

            if (token == IntPtr.Zero)
            {
                if (LogonUserA(userName, domain, password, LOGON32_LOGON_INTERACTIVE,
                LOGON32_PROVIDER_DEFAULT, ref token) == 0) throw new Exception("User authentication failed.");
            }
            if (DuplicateToken(token, 2, ref tokenDuplicate) == 0) throw new Exception("User token duplication failed.");

            tempWindowsIdentity = new WindowsIdentity(tokenDuplicate);
            impersonationContext = tempWindowsIdentity.Impersonate();
            if (impersonationContext != null)
            {
                CloseHandle(tokenDuplicate);
                return true;
            }

            if (tokenDuplicate != IntPtr.Zero)
                CloseHandle(tokenDuplicate);
            return false;
        }

        public object doImpersonateJob(String userName, String domain, String password, Func<object> toDo)
        {
            object result;
            if (impersonateValidUser(userName, domain, password))
            {
                result = toDo();
                undoImpersonation();
            }
            else
            {
                throw new Exception("Authentication failed");
            }
            return result;
        }

        private void undoImpersonation()
        {
            impersonationContext.Undo();
        }

        public void Dispose()
        {
            if (token != IntPtr.Zero)
                CloseHandle(token);
        }
    }
}