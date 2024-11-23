FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5288

ENV ASPNETCORE_URLS=http://+:5288

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs
WORKDIR /src
COPY ["Onion.CleanArchitecture/Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp/Onion.CleanArchitecture.WebApp.csproj", "Onion.CleanArchitecture/Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp/"]
RUN dotnet restore "Onion.CleanArchitecture/Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp/Onion.CleanArchitecture.WebApp.csproj"
COPY . .
WORKDIR "/src/Onion.CleanArchitecture/Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp"
RUN dotnet build "Onion.CleanArchitecture.WebApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Onion.CleanArchitecture.WebApp.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Onion.CleanArchitecture.WebApp.dll"]
