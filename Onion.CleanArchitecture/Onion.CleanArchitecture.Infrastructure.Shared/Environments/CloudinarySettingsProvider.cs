﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;

namespace Onion.CleanArchitecture.Infrastructure.Shared.Environments
{
    public class CloudinarySettingsProvider : ICloudinarySettingsProvider
    {
        private readonly IHostEnvironment _env;
        private readonly IConfiguration _config;
        public CloudinarySettingsProvider(
            IHostEnvironment env,
            IConfiguration config
            )
        {
            _env = env;
            _config = config;
        }

        public string GetConnectionString()
        {
            var isHasMySQLConnectionString = EnvironmentVariables.HasCloudinaryCloudUrl();
            if (_env.IsProduction() && isHasMySQLConnectionString)
            {
                return Environment.GetEnvironmentVariable(EnvironmentVariables.ElasticApiKey);
            }
            return _config["UploadProvider:CloudinaryUrl"];
        }
    }
}
