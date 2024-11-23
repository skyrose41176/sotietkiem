# Onion Architecture In ASP.NET Core With CQRS

https://craftbakery.dev/make-your-own-custom-netcore-template/

# Install template

dotnet new -i Onion.CleanArchitecture.Template\

# Uninstall template

dotnet new -u Onion.CleanArchitecture.Template\

# Create a project using the template

dotnet new onion-clean -n Ecommerce -au "ToanLe" -d "The ecommerce project for business" -y 2024
dotnet new onion-clean -n TraSoatKhieuNai -au thott --force -o "TraSoatKhieuNai"

# Run docker sql server as command below

docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=sql@pa22w0rd" -p 1433:1433 -d --name=sqlserver mcr.microsoft.com/mssql/server:2022-preview-ubuntu-22.04

# Create policy.csv file in Onion.CleanArchitecture/Onion.CleanArchitecture.WebApp.Server/wwwroot/policy.csv

Add default row as below
p, SuperAdmin, users, list
p, SuperAdmin, users, create
p, SuperAdmin, roleclaims, list
p, SuperAdmin, roleclaims, create
p, SuperAdmin, roleclaims, show
p, SuperAdmin, roleclaims, edit
p, SuperAdmin, roleclaims, delete
p, SuperAdmin, roles, list
p, SuperAdmin, roles, create
p, SuperAdmin, roles, show
p, SuperAdmin, roles, edit
p, SuperAdmin, roles, delete
p, SuperAdmin, identity, list
p, SuperAdmin, policy, list
p, SuperAdmin, policy, create
p, SuperAdmin, policy, show
p, SuperAdmin, policy, edit
p, SuperAdmin, policy, delete

# Run dotnet run in Onion.CleanArchitecture.WebApp.Server

# Access https://localhost:5173/ on browser

# Login with username:superadmin@gmail.com and password:123Pa$$word!

## git ignore not working

# First commit any outstanding code changes, and then, run this command:

`bash
git rm -r --cached .
`

# This removes any changed files from the index(staging area), then just run:

`bash
git add .
`

# Commit it:

`bash
git commit -m ".gitignore is now working"
`
