import { Routes, Route, Link } from 'react-router-dom'
import '../styles/EstilosGlobal.css'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient.js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Feed from '../components/Feed/Feed.jsx'
import '../styles/threads-feed.css'


function Home() {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState()

    useEffect(() => {

        const getSessionAndUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            if (session?.user) setUser(session.user);

            if (session) {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)

            }
        }

        getSessionAndUser()

        const { data: { subscription }, } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
            <div className="containerbkg">
                    <div className="logo"></div>

                <div className='home'>
                    <br />
                    <div className="welcome"><Feed /></div>
                    <br />
                    <div className="footer">
                        <button onClick={signOut} className='salida'> Sign Out</button>
                    </div>
                </div>

            </div>)
    }


}

export default Home