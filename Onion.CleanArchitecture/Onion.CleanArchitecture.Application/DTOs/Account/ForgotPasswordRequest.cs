﻿using System.ComponentModel.DataAnnotations;

namespace Onion.CleanArchitecture.Application.DTOs.Account
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
