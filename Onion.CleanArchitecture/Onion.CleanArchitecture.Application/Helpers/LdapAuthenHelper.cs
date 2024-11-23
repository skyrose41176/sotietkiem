using Novell.Directory.Ldap;
using Onion.CleanArchitecture.Application.Consts.Ldaps;
using System;

namespace Onion.CleanArchitecture.Application.Helpers
{
    public class LdapAuthenHelper : ILdapAuthenHelper
    {
        public LdapInfo AuthenInfoMail(string user, LdapConfig config)
        {
            LdapConnection connection = null;
            LdapInfo? rs = null;
            string ldapDomain = Environment.GetEnvironmentVariable(LDapConst.LdapDomain) ?? config.LdapDomain;
            int ldapPort = String.IsNullOrEmpty(Environment.GetEnvironmentVariable(LDapConst.LdapPort))
                            ? config.LdapPort
                            : Int32.Parse(Environment.GetEnvironmentVariable(LDapConst.LdapPort));
            string ldapUser = Environment.GetEnvironmentVariable(LDapConst.LdapUser) ?? Environment.GetEnvironmentVariable(LDapConst.LdapUser) ?? config.LdapUser;
            string ldapPassword = Environment.GetEnvironmentVariable(LDapConst.LdapPassword) ?? config.LdapPassword;
            string ldapPath = Environment.GetEnvironmentVariable(LDapConst.LdapPath) ?? config.LdapPath;
            Console.WriteLine("ldapDomain: " + ldapDomain);
            Console.WriteLine("ldapPort: " + ldapPort);
            Console.WriteLine("ldapUser: " + ldapUser);
            Console.WriteLine("ldapPassword: " + ldapPassword);
            Console.WriteLine("ldapPath: " + ldapPath);
            try
            {
                int searchScope = LdapConnection.ScopeSub;
                string searchFilter = $"(&(objectCategory=person)(objectClass=user)(sAMAccountName={user}))";
                string searchBase = ldapPath;

                connection = new LdapConnection();
                connection.Connect(ldapDomain, ldapPort);
                connection.Bind(ldapUser, ldapPassword);

                if (connection.Connected)
                {
                    var searchResults = connection.Search(
                    searchBase,
                    searchScope,
                    searchFilter,
                    null, // no specified attributes
                    false); // return attr and value

                    while (searchResults.HasMore())
                    {
                        LdapEntry nextEntry = null;
                        nextEntry = searchResults.Next();
                        if (nextEntry.GetAttribute("mail") != null)
                        {
                            rs = new LdapInfo()
                            {
                                DisplayName = nextEntry.GetAttribute("displayName").StringValue,
                                EmailAddress = nextEntry.GetAttribute("mail").StringValue
                            };
                        }

                    }
                }
                return rs;
            }
            catch (Exception)
            {
                return rs;
                throw;
            }
            finally
            {
                connection.Disconnect();
            }

        }
    }

    public interface ILdapAuthenHelper
    {
        LdapInfo AuthenInfoMail(string user, LdapConfig config);
    }
    public class LdapConfig
    {
        public int LdapPort { get; set; }
        public string? LdapDomain { get; set; }
        public string? LdapPath { get; set; }
        public string? LdapUser { get; set; }
        public string? LdapPassword { get; set; }
    }

    public class LdapInfo
    {
        public string? EmailAddress { get; set; }
        public string? Name { get; set; }
        public string? DisplayName { get; set; }
        public string? DistinguishedName { get; set; }
        public string? EmployeeId { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName { get; set; }
        public string? Surname { get; set; }
        public string? VoiceTelephoneNumber { get; set; }
    }

    public class LdapAuthen
    {
        public string? userAd { get; set; }
    }
}
