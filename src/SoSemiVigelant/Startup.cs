using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SoSemiVigelant.Core.Models;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Models.Auction;
using SoSemiVigelant.Models.User;
using SoSemiVigelant.Provider;

namespace SoSemiVigelant
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();

            DatabaseContextFactory.ConnectionString = Configuration["ConnectionStrings:DefaultConnection"];
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddMvc();

            services.AddSingleton<IPagesLoader, PagesLoader>();
            services.AddSingleton<IListFactory<AuctionModel, AuctionListRequest>, AuctionListFactory>();
            services.AddSingleton<IListFactory<UserModel, UserListRequest>, UserListFactory>();
            services.AddEntityFrameworkNpgsql()
                    .AddDbContext<DatabaseContext>(options => options.UseNpgsql(
                    DatabaseContextFactory.ConnectionString, b => b.MigrationsAssembly("SoSemiVigelant.Data")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            MigrateDatabase();

            app.UseCors(builder => builder.AllowAnyOrigin().AllowCredentials().AllowAnyMethod().AllowAnyHeader());

            app.UseApplicationInsightsRequestTelemetry();

            app.UseApplicationInsightsExceptionTelemetry();

            app.UseMvc();
        }

        private void MigrateDatabase()
        {
            var factory = new DatabaseContextFactory();
            factory.MigrateToLatest();
        }
    }
}
