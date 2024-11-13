'use client'

import {useEffect, useState} from "react";
import Link from 'next/link'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useRouter} from "next/navigation";

const fetchLogin = async (loginInfo: { email: string, password: string }) => {
    try {
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
        })

        const data = await response.json()
        if (!response.ok) {
            return null
        }

        return data
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}

export default function Login() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {

    }, [error]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setLoginInfo({...loginInfo, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const user_data = await fetchLogin(loginInfo)
        if (user_data === null || user_data === undefined) {
            setError('Invalid email or password')
        } else {
            localStorage.setItem('user-info', JSON.stringify(user_data))
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Rent a car</CardTitle>
                    <CardDescription>Enter your credentials to login</CardDescription>
                    {error ?
                        <CardDescription>{error}</CardDescription>
                        : <></>
                    }
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email"
                                       type="email"
                                       name="email"
                                       placeholder="you@example.com"
                                       value={loginInfo.email}
                                       onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password"
                                       type="password"
                                       name="password"
                                       value={loginInfo.password}
                                       onChange={handleInputChange}
                                       required/>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full">Log in</Button>
                        <p className="text-sm text-center">
                            ¿Not have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}