import { authProvider } from "@providers/auth-provider";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(search);
      const jwtoken = params.get("jwtoken");
      if (jwtoken) {
        const result = await authProvider.loginJwt({ jwtoken });
        if (result.success) {
          navigate("/");
        } else {
          navigate("/login-ad");
        }
      } else {
        navigate("/login-ad");
      }
    };

    handleLogin();
  }, [search, navigate]);

  return (
    <div>
      <h1>Logging in...</h1>
    </div>
  );
};

export default LoginPage;
