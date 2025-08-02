import React from 'react'
import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import '../../App.css'


function Login() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        async function obtenerUsuario() {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error al obtener usuario:", error.message);
            } else {
                console.log("Usuario:", data.user);
                const user = data.user;
                setUsuario(user);
                
            }
        }

      obtenerUsuario();
    }, []);


    if (!usuario) return <p className='cargando'>Cargando usuario...</p>;

    return (
        <div>

            <header className="perfil-header">
                <div className="perfil-usuario">
                    <span className='perfil-nombre'>{usuario.user_metadata.name}</span>
                    <img className='perfil-avatar'
                        src={usuario.user_metadata.avatar_url}
                        alt="Foto de perfil"
                        width={100}
                        style={{ borderRadius: "50%" }}
                    />
                    <span className='perfil-email'>Email: {usuario.user_metadata.email}</span>
                </div>
            </header>
        </div>
    );
}

export default Login