'use client'

import {useEffect, useState} from 'react'
import {format} from 'date-fns'
import {es} from 'date-fns/locale'
import {CarFront, Calendar, MapPin, DollarSign, MessageSquare, Star, Search, DoorOpen} from 'lucide-react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

// Definición de tipos
type Message = {
    id: number
    created_at: string
    booking_id: number
    message: string
}

type Vehicle = {
    id: number
    status: string
    brand_model: string
    brand: string
    transmission_type: string
    year: number
    type: string
    hourly_fare: number
}

type Booking = {
    id: number
    created_at: string
    updated_at: string
    status: string
    user_id: number
    vehicle: Vehicle
    observations: string
    feedback: string | null
    rating: number | null
    start_date: string
    end_date: string
    pick_up_location: string
    drop_off_location: string
    hourly_fare: number
    total_amount: number
    messages: Message[]
}

const fetchDashboardData = async (userId: string) => {
    try {
        const response = await fetch('http://localhost:8080/bookings?user_id=' + userId)

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

const fetchAdminDashboardData = async () => {
    try {
        const response = await fetch('http://localhost:8080/bookings/admin')

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

const fetchCancelBooking = async (userId: number, bookingId: number) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/cancel', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingId,
                user_id: userId
            })
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

const fetchConfirmBooking = async (userId: number, bookingId: number) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/confirm', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingId,
                user_id: userId
            })
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

const fetchFinishBooking = async (userId: number, bookingId: number) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/finish', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingId,
                user_id: userId
            })
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

const fetchSendMessage = async (userId: number, bookingId: number, message: string) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingId,
                user_id: userId,
                message: message
            })
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

const fetchSendFeedback = async (userId: number, bookingId: number, feedback: string) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/feedback', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bookingId,
                user_id: userId,
                feedback: feedback
            })
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


// Componente principal
export default function Dashboard() {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('user-info') || '{}')
    const [bookings, setBookings] = useState([])
    const [message, setMessage] = useState('')
    const [feedback, setFeedback] = useState('')

    useEffect(() => {
        if (user?.type === 'admin') {
            fetchAdminData()
        } else {
            fetchData(user.id.toString())
        }
    }, []);

    const handleCancelBooking = async (bookingId: number) => {
        await fetchCancelBooking(user.id, bookingId)
        await fetchData(user.id.toString())
    }

    const handleConfirmBooking = async (bookingId: number) => {
        await fetchConfirmBooking(user.id, bookingId)
        await fetchData(user.id.toString())
    }

    const handleFinishBooking = async (bookingId: number) => {
        await fetchFinishBooking(user.id, bookingId)
        await fetchData(user.id.toString())
    }

    const handleSendMessage = async (bookingId: number) => {
        if (message === '') {
            return
        }
        await fetchSendMessage(user.id, bookingId, message)
        await fetchData(user.id.toString())
        setMessage('')
    }

    const handleSendFeedback = async (bookingId: number) => {
        if (feedback === '') {
            return
        }
        await fetchSendFeedback(user.id, bookingId, feedback)
        await fetchData(user.id.toString())
        setFeedback('')
    }

    const handleLogOut = () => {
        localStorage.removeItem('user-info')
        router.push("/")
    }

    const fetchData = async (id: string) => {
        const data = await fetchDashboardData(id)
        if (data) {
            setBookings(data)
        }
    }

    const fetchAdminData = async () => {
        const data = await fetchAdminDashboardData()
        if (data) {
            setBookings(data)
        }
    }

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy HH:mm", {locale: es})
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'reservado':
                return 'bg-yellow-500'
            case 'finalizado':
                return 'bg-green-500'
            case 'cancelado':
                return 'bg-red-500'
            case 'confirmado':
                return 'bg-blue-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <div>
                    <Button variant="destructive"
                            className="mr-2"
                            onClick={() => handleLogOut()}>
                        <DoorOpen />  Log Out
                    </Button>
                    {user.type === 'client' && (
                        <Link href="/search">
                            <Button>
                                <Search className="mr-2 h-4 w-4"/> Search bookings
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Pick Up Location</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking: Booking) => (
                        <TableRow key={booking.id}>
                            <TableCell>{booking.id}</TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </TableCell>
                            <TableCell>
                                {booking.vehicle.brand} {booking.vehicle.brand_model} ({booking.vehicle.year})
                            </TableCell>
                            <TableCell>{formatDate(booking.start_date)}</TableCell>
                            <TableCell>{formatDate(booking.end_date)}</TableCell>
                            <TableCell>{booking.pick_up_location}</TableCell>
                            <TableCell>${booking.total_amount}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Details</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>Booking Details</DialogTitle>
                                            <DialogDescription>
                                                Booking ID: {booking.id}
                                            </DialogDescription>
                                        </DialogHeader>
                                        {/* Booking and vehicle details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold mb-2">Vehicle information</h3>
                                                <p><CarFront className="inline mr-2"/>
                                                    {booking.vehicle.brand} {booking.vehicle.brand_model}
                                                </p>
                                                <p>Year: {booking.vehicle.year}</p>
                                                <p>Type: {booking.vehicle.type}</p>
                                                <p>Transmission: {booking.vehicle.transmission_type}</p>
                                                <p>Hourly Fare: ${booking.vehicle.hourly_fare}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">Booking Details</h3>
                                                <p>
                                                    <Calendar className="inline mr-2"/>
                                                    Starts on: {formatDate(booking.start_date)}
                                                </p>
                                                <p>
                                                    <Calendar className="inline mr-2"/> Ends
                                                    on: {formatDate(booking.end_date)}
                                                </p>
                                                <p>
                                                    <MapPin className="inline mr-2"/>
                                                    Pick Up: {booking.pick_up_location}
                                                </p>
                                                <p>
                                                    <MapPin className="inline mr-2"/>
                                                    Drop Off: {booking.drop_off_location}
                                                </p>
                                                <p>
                                                    <DollarSign className="inline mr-2"/>
                                                    Total amount: ${booking.total_amount}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Change booking status buttons */}
                                        <div className="mt-4">
                                            <div className="flex space-x-2">
                                                {booking.status === 'reservado' && (
                                                    <Button variant="destructive"
                                                            onClick={() => handleCancelBooking(booking.id)}> Cancel
                                                        booking </Button>
                                                )}
                                                {user?.type === 'admin' && booking.status == 'reservado' && (
                                                    <Button variant="outline"
                                                            onClick={() => handleConfirmBooking(booking.id)}>Confirm
                                                        booking </Button>
                                                )}
                                                {user?.type === 'admin' && booking.status == 'confirmado' && (
                                                    <Button variant="default"
                                                            onClick={() => handleFinishBooking(booking.id)}> End
                                                        booking </Button>
                                                )}
                                            </div>
                                        </div>
                                        {/* Messages */}
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Messages</h3>
                                            {user.type === 'client' && (
                                                <div className="flex justify-between items-center mb-5">
                                                    <Input id="add-message-input"
                                                           type="text"
                                                           name="message"
                                                           value={message}
                                                           onChange={(e) => setMessage(e.target.value)}
                                                           placeholder="Enter your message to admins"
                                                           required
                                                           className="mr-2 mb-2"
                                                    />
                                                    <Button variant="default"
                                                            className="mb-2"
                                                            onClick={() => handleSendMessage(booking.id)}>
                                                        Send message
                                                    </Button>
                                                </div>
                                            )}
                                            {booking.messages.map((message) => (
                                                <div key={message.id} className="bg-gray-100 p-2 rounded mb-2">
                                                    <p><MessageSquare className="inline mr-2"/> {message.message}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{formatDate(message.created_at)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Feedback */}
                                        <div className="mt-4">
                                            <h3 className="font-semibold mb-2">Feedback</h3>
                                            {user.type === 'client' && booking.feedback === null && booking.status === "finalizado" && (
                                                <div className="flex justify-between items-center mb-5">
                                                    <Input id="add-message-input"
                                                           type="text"
                                                           name="message"
                                                           value={feedback}
                                                           onChange={(e) => setFeedback(e.target.value)}
                                                           placeholder="Enter your feedback to admins"
                                                           required
                                                           className="mr-2 mb-2"
                                                    />
                                                    <Button variant="default"
                                                            className="mb-2"
                                                            onClick={() => handleSendFeedback(booking.id)}>
                                                        Send feedback
                                                    </Button>
                                                </div>
                                            )}
                                            {booking.feedback && (
                                                <>
                                                    <p>{booking.feedback}</p>
                                                    {booking.rating &&
                                                        <p>
                                                            <Star
                                                                className="inline mr-2"/> Calificación: {booking.rating}/5
                                                        </p>
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}