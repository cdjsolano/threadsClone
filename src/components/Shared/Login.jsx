import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import "../../styles/EstilosGlobal.css";

function Login() {
    const { user, loading, loginWithGoogle, logout } = useAuth();

    if (loading) return <div className="loading">Cargando...</div>;

    // 🔹 Si ya está logueado, redirige a /home
    if (user) return <Navigate to="/home" replace />;

    else

        if (!user) {
            return (<div className="landpage">
                <div className="card">
                    <Auth supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        providers={['google']} />
                </div>
            </div>);
        }
}

export default Login;
