dotnet ef database update --context ApplicationDbContext
dotnet ef database update --context IdentityContext

dotnet ef migrations add InitialIdentity --context IdentityContext -o ../Onion.CleanArchitecture.Infrastructure.Identity/Migrations
dotnet ef migrations add InitialIdentity --context IdentityContext -o Migrations/Identity

dotnet ef dbcontext list
dotnet ef migrations add InitialCreate --context ApplicationDbContext
dotnet ef migrations add InitialCreate --context IdentityContext

docker build -f Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp.Server/Dockerfile -t onion.clean:v.0.1 .

docker network create -d bridge ecommerce
docker network connect ecommerce sqlserver

git config core.ignorecase true
git config --global core.ignorecase true

p, SuperAdmin, roleclaims, list
p, SuperAdmin, roleclaims, create
p, SuperAdmin, roleclaims, show
p, SuperAdmin, roleclaims, edit
p, SuperAdmin, roleclaims, delete

docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=sql@pa22w0rd" -p 1433:1433 -d --name=sqlserver mcr.microsoft.com/mssql/server:2022-preview-ubuntu-22.04

git rm --cached Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp.Client/Onion.CleanArchitecture.WebApp.Client.esproj
git rm --cached ./Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp.Client/Onion.CleanArchitecture.WebApp.Client.esproj

"git rm --cached \*\*/appsettings.Development.json"
