"use client";
import axios from "axios";
import "src/styles/login.css";
import "src/styles/emailverify.css";
import Link from "next/link"
import React, { useEffect, useState } from "react";
export default function VerifyEmailPage(){
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', {token})
            setVerified(true)
            console.log(`setVerified: ${setVerified}`)
        } catch (error: any) {
            setError(true);
            console.log(error.response.data)
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
        console.log(urlToken)
    },[])

    

    useEffect(() => {
        if(token.length > 0){
            verifyUserEmail();
            console.log(token)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])

   

    return (
        <div className="container">
             <h1 className="title">Verify Email</h1>
             <h2 className="token">{token ? `${token}` : "No Token"}</h2>
            {verified && (
                <div>
                    <h2 className="success">Email Verified</h2>
                    <Link href="/login" className="link">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="error">Error</h2>
                </div>
            )}
        </div>
    )


}