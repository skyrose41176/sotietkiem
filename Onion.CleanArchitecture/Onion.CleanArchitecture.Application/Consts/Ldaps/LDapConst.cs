using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Consts.Ldaps
{
    public class LDapConst
    {
        public static string LdapPort { get; set; } = "LDAP_PORT";
        public static string LdapDomain { get; set; } = "LDAP_DOMAIN";
        public static string LdapPath { get; set; } = "LDAP_PATH";
        public static string LdapUser { get; set; } = "LDAP_USER";
        public static string LdapPassword { get; set; } = "LDAP_PASSWORD";
    }
}