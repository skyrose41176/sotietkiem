﻿using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.Enums;
using Onion.CleanArchitecture.Infrastructure.Identity.Models;
using System.Linq;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Seeds
{
    public static class DefaultSuperAdmin
    {
        public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            //Seed Default User
            var defaultUser = new ApplicationUser
            {
                UserName = "superadmin",
                Email = "superadmin@gmail.com",
                FirstName = "Mukesh",
                LastName = "Murugan",
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                MaNhanVien = "1"
            };
            if (userManager.Users.All(u => u.Id != defaultUser.Id))
            {
                var user = await userManager.FindByEmailAsync(defaultUser.Email);
                if (user == null)
                {
                    await userManager.CreateAsync(defaultUser, "123Pa$$word!");
                    await userManager.AddToRoleAsync(defaultUser, Roles.SuperAdmin.ToString());

                    // Get the SuperAdmin role
                    var role = await roleManager.FindByNameAsync(Roles.SuperAdmin.ToString());

                    // Add the RoleClaim to the SuperAdmin role
                    var claim = new System.Security.Claims.Claim("roleclaims", "list#create#edit#delete");
                    await roleManager.AddClaimAsync(role, claim);
                    var userClaims = new System.Security.Claims.Claim("users", "list#create");
                    await roleManager.AddClaimAsync(role, userClaims);
                    var identityClaims = new System.Security.Claims.Claim("identity", "list");
                    await roleManager.AddClaimAsync(role, identityClaims);
                    var settingClaims = new System.Security.Claims.Claim("setting", "list");
                    await roleManager.AddClaimAsync(role, settingClaims);
                    var policyClaims = new System.Security.Claims.Claim("policy", "list#create#edit#delete");
                    await roleManager.AddClaimAsync(role, policyClaims);
                    var roles = new System.Security.Claims.Claim("roles", "list#create#edit");
                    await roleManager.AddClaimAsync(role, roles);
                }

            }
        }
    }
}
