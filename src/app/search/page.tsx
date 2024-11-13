'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {format} from "date-fns"
import {es} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {cn} from "@/lib/utils"
import Link from 'next/link'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useRouter} from "next/navigation";

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

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    // Offset
    const minutesOffset = -date.getTimezoneOffset();
    const sign = minutesOffset >= 0 ? '+' : '-';
    const hoursOffset = String(Math.abs(minutesOffset) / 60).padStart(2, '0');
    const leftMinutesOffset = String(Math.abs(minutesOffset) % 60).padStart(2, '0');
    const offset = `${sign}${hoursOffset}:${leftMinutesOffset}`;

    // Build date in format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offset}`;
}

const fetchAvailableVehicles = async (from: string, to: string) => {
    try {
        const response = await fetch('http://localhost:8080/bookings/available-vehicles?from=' + from + "&to=" + to)

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

const fetchCreateBooking = async (userId: number, vehicleId: number, from: string, to: string, pickUp: string, dropOff: string) => {
    try {
        const response = await fetch('http://localhost:8080/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                vehicle_id: vehicleId,
                start_date: from,
                end_date: to,
                pick_up_location: pickUp,
                drop_off_location: dropOff
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

export default function Search() {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('user-info') || '{}')
    const [pickUpDate, setPickUpDate] = useState<Date>(new Date())
    const [dropOffDate, setDropOffDate] = useState<Date>(new Date())
    const [pickUpLocation, setPickUpLocation] = useState('Agency')
    const [dropOffLocation, setDropOffLocation] = useState('Agency')
    const [searchResults, setSearchResults] = useState<Vehicle[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const adjustedFromDate = new Date(pickUpDate.setHours(9, 0, 0, 0))
        const adjustedToDate = new Date(dropOffDate.setHours(23, 59, 0, 0))
        const from = formatDate(adjustedFromDate)
        const to = formatDate(adjustedToDate)
        const data = await fetchAvailableVehicles(from, to)
        if (data) {
            setSearchResults(data)
        } else {
            alert("No results! :c")
        }
    }

    const handleBookButton = async (vehicleId: number) => {
        if (pickUpLocation === "") {
            setPickUpLocation("Agency")
        }

        if (dropOffLocation === "") {
            setDropOffLocation("Agency")
        }

        const adjustedFromDate = new Date(pickUpDate.setHours(9, 0, 0, 0))
        const adjustedToDate = new Date(dropOffDate.setHours(23, 59, 0, 0))
        const from = formatDate(adjustedFromDate)
        const to = formatDate(adjustedToDate)
        const data = await fetchCreateBooking(user.id, vehicleId, from, to, pickUpLocation, dropOffLocation)
        if (data) {
            router.push("/dashboard")
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold">Search bookings</h1>
                <Link href="/dashboard">
                    <Button variant="outline">Go back to dashboard</Button>
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="pickUpDate" className="font-medium">
                            Pick Up Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="pickUpDate"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !pickUpDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {pickUpDate ? format(pickUpDate, "PPP", {locale: es}) :
                                        <span>Select date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={pickUpDate}
                                    onSelect={setPickUpDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="dropOffDate" className="font-medium">
                            Drop Off Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="dropOffDate"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dropOffDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                    {dropOffDate ? format(dropOffDate, "PPP", {locale: es}) :
                                        <span>Select date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dropOffDate}
                                    onSelect={setDropOffDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="pickupLocation" className="font-medium">
                            Pick Up Location
                        </label>
                        <Input
                            id="pickupLocation"
                            placeholder="Enter pick up location"
                            value={pickUpLocation}
                            onChange={(e) => setPickUpLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="dropOffLocation" className="font-medium">
                            Drop Off Location
                        </label>
                        <Input
                            id="dropOffLocation"
                            placeholder="Enter drop off location"
                            value={dropOffLocation}
                            onChange={(e) => setDropOffLocation(e.target.value)}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full md:w-auto">Search</Button>
            </form>

            {searchResults.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Resultados de la búsqueda</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Transmission</TableHead>
                                <TableHead>Hourly Fare</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchResults.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell>{vehicle.id}</TableCell>
                                    <TableCell>{vehicle.brand}</TableCell>
                                    <TableCell>{vehicle.brand_model}</TableCell>
                                    <TableCell>{vehicle.year}</TableCell>
                                    <TableCell>{vehicle.type}</TableCell>
                                    <TableCell>{vehicle.transmission_type}</TableCell>
                                    <TableCell>${vehicle.hourly_fare}</TableCell>
                                    <TableCell>
                                        <Button variant="outline"
                                                onClick={() => handleBookButton(vehicle.id)}>
                                            <CalendarIcon /> Book
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}