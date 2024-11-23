namespace Onion.CleanArchitecture.Application.Consts.Rabbits
{
    public class RabbitMqEnvConst
    {
        public static string Host { get; set; } = "RABBITMQ_HOST";
        public static string Vhost { get; set; } = "RABBITMQ_VHOST";
        public static string User { get; set; } = "RABBITMQ_USER";
        public static string Pass { get; set; } = "RABBITMQ_PASS";
        public static string Mail { get; set; } = "RABBITMQ_MAIL";
    }

    public static class RabbitMqAppConst
    {
        public static string Host { get; set; } = "RabbitMq:Host";
        public static string Vhost { get; set; } = "RabbitMq:vHost";
        public static string User { get; set; } = "RabbitMq:Username";
        public static string Pass { get; set; } = "RabbitMq:Password";
        public static string Mail { get; set; } = "Mail";
    }
}
