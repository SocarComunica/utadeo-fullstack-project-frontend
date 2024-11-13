'use client'

import Link from 'next/link'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import {useRouter} from "next/navigation";
import {useState} from "react";

const fetchRegister = async (registerInfo: {
    email: string,
    name: string,
    password: string,
    dni: string
}) => {
    try {
        const response = await fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerInfo)
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

export default function Register() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [dni, setDni] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const registerInfo = {
            email,
            name,
            password,
            dni
        }

        const user_data = await fetchRegister(registerInfo)
        if (user_data === null || user_data === undefined) {
            alert("An error occurred while registering the user")
        } else {
            localStorage.setItem('user-info', JSON.stringify(user_data))
            router.push('/dashboard')
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email"
                                       type="email"
                                       placeholder="you@example.com"
                                       value={email}
                                       onChange={e => setEmail(e.target.value)}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name"
                                       type="text"
                                       placeholder="Your name"
                                       value={name}
                                       onChange={e => setName(e.target.value)}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password"
                                       type="password"
                                       placeholder="Your password"
                                       value={password}
                                       onChange={e => setPassword(e.target.value)}
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni"
                                       type="text"
                                       placeholder="12345678"
                                       value={dni}
                                       onChange={e => setDni(e.target.value)}
                                       required/>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full">Register</Button>
                        <p className="text-sm text-center">
                            ¿Already have an account?{' '}
                            <Link href="/" className="text-blue-600 hover:underline">
                                Log in here
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}