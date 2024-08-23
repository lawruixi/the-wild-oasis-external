"use client";

import { deleteBooking } from "../_lib/actions";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";

// This was extracted into its own component from the Reservations/page.js since
// we are using the useOptimistic hook and only client components can use hooks.
export default function ReservationList({ bookings }) {
    // Optimistically update the UI assuming the operation goes through, increasing 
    // apparent responsiveness.
    const [optimisticBookings, optimisticDelete] = useOptimistic(
        bookings,
        // Function here takes in current state, and another value
        // that will help determine the next optimistic state.
        (currentBookings, bookingId) => {
            return currentBookings.filter(booking => booking.id !== bookingId)
        }
    );

    async function handleDelete(bookingId) {
        optimisticDelete(bookingId);
        await deleteBooking(bookingId);
    }

    // Prop drill handleDelete down the tree until it reaches DeleteReservation.
    return (
        <ul className="space-y-6">
            {optimisticBookings.map((booking) => (
                <ReservationCard
                    booking={booking}
                    onDelete={handleDelete}
                    key={booking.id}
                />
            ))}
        </ul>
    );
}
