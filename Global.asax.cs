using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Routing;
using TIS_ESPC_FORK.Models.Repositories;

namespace TIS_ESPC_FORK
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        CancellationTokenSource cSource;


        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            cSource = new CancellationTokenSource();

            try
            {
                string ip = Dns
                    .GetHostEntry(Dns.GetHostName())
                    .AddressList
                    .Where(bytes => bytes.ToString().StartsWith("10.2."))
                    .FirstOrDefault().ToString();

                if (ip == "10.2.19.193") Task.Run(() => HalfMinuteInterval(cSource.Token));
            }
            catch (Exception) { }
        }


        /// <summary>
        /// Triggers any handler each single 30s
        /// </summary>
        async Task HalfMinuteInterval(CancellationToken cToken)
        {
            while (!cToken.IsCancellationRequested)
            {
                try
                {
                    await AgregateRepository.UpdateHeatEndTimeAsync();
                    await Task.Delay(TimeSpan.FromSeconds(30));
                }
                catch (Exception) { }
            }
        }





        public override void Dispose()
        {
            cSource.Cancel();
            base.Dispose();
        }
    }
}
