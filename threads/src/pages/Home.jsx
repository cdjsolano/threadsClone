import { Routes, Route, Link} from 'react-router-dom'
import '../EstilosGlobal.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient.js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Feed from '../components/Feed/Feed.jsx'
import Login from '../components/Profile/Login.jsx'

import Crearpost from '../components/Feed/Crearpost.jsx'



function Home() {
    const [session, setSession] = useState(null)
    const [user, setUser]   = useState()
    
    

    useEffect(() => {

        const getSessionAndUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            if (session?.user) setUser(session.user);

            if (session) {const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
                
            }
        }

         getSessionAndUser()

        const {data: { subscription }, } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session)
                     
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
      

    };

    if (!session) {
        return (
            <div className="landpage">
                <div className="card">
                    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />
                </div>
            </div>
        )
    }
    else {
        return (
        <div className='home'>  
         <Login></Login>
        
        <br />
        <div className="welcome">
        <h2>@THREADS</h2> 
         
      
          <br /><br /><br /><br /><br /><br />

            <Feed actualUser={user}></Feed>

            <br /><br /><br />

        </div>
            <div className="footer">

                <button onClick={signOut} className='salida'> Sign Out</button>
            </div>
        </div>)
    }


}

export default Home