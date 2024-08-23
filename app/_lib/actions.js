"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import {
    updateGuest as updateGuestApi,
    deleteBooking as deleteBookingApi,
    getBookings,
    updateBooking as updateBookingApi,
    createBooking as createBookingApi
} from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
    // Form Data automatically passed to server action when form is submitted.

    // When doing server actions (or receiving client data in general), must do two important steps:
    // 1. Check if user is authorized.
    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in.");
    }

    // Retrieve values using FormData Web API.
    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split("%");

    // 2. Check for valid inputs.
    const regex = /^[a-zA-Z0-9]{6,12}$/;
    if (!regex.test(nationalID)) {
        throw new Error("Please provide a valid nationalID.");
    }

    const updateData = { nationality, countryFlag, nationalID };

    updateGuestApi(session.user.guestId, updateData);

    // Clear cache for the form page.
    revalidatePath("/account/profile");
}

export async function editReservation(formData) {
    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in.");
    }

    // Check if user is editing a booking they booked.
    const bookingId = Number(formData.get("bookingId"));
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingsIds = guestBookings.map((booking) => booking.id);
    if (!guestBookingsIds.includes(bookingId)) {
        throw new Error("You are not authorized to edit this booking.");
    }

    const updateData = {
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations").slice(0, 1000),
    };

    updateBookingApi(bookingId, updateData);

    revalidatePath("/account/reservations");
    revalidatePath(`/account/reservations/edit/${bookingId}`);
    redirect("/account/reservations");
}

// Accepts a parameter since it is being called directly and not via a form.
export async function deleteBooking(bookingId) {
    // By the way, if we ever write a server action in a component,
    // we'll need to put
    // "use server";
    // on the top line of the action to "register" it as a server action (making sure it only stays on the server
    // even if it could be rendered as a client component).

    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in.");
    }

    // Exploit: since only user being authenticated and the bookingId is required to delete a booking,
    // any authenticated user can delete any booking, including those not attributed to them.
    // To fix this we check for guestId === booking.guestId.
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingsIds = guestBookings.map((booking) => booking.id);
    if (!guestBookingsIds.includes(bookingId)) {
        throw new Error("You are not authorized to delete this booking.");
    }

    deleteBookingApi(bookingId);

    revalidatePath("/account/reservations");
}

// Form data is second argument here because this method is called via binding bookingData
// arguments to it. For more information refer to ReservationForm.js where createBooking is bound.
export async function createBooking(bookingData, formData) {
    const session = await auth();

    const newBooking = {
        ...bookingData,
        guestId: session.user.guestId,
        numGuests: Number(formData.get('numGuests')),
        observations: formData.get("observations"),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        status: "unconfirmed",
        hasBreakfast: false,
        isPaid: false
    }

    createBookingApi(newBooking);

    revalidatePath(`/cabins/${bookingData.cabinId}`);

    redirect('/cabins/thankyou')
}

export async function signInAction() {
    // Provider names can be found in /api/auth/providers.
    await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
    // Provider names can be found in /api/auth/providers.
    await signOut({ redirectTo: "/" });
}
