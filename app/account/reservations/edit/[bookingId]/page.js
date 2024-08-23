import SubmitButton from "@/app/_components/SubmitButton";
import { editReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
    const bookingId = params.bookingId;
    const booking = await getBooking(bookingId);

    const cabinId = booking.cabinId;
    const cabin = await getCabin(cabinId);

    const currentNumGuests = booking.numGuests;
    const currentObservations = booking.observations;
    const maxCapacity = cabin.maxCapacity;

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                Edit Reservation #{bookingId}
            </h2>

            <form
                action={editReservation}
                className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
            >
                <div className="space-y-2">
                    <label htmlFor="numGuests">How many guests?</label>
                    <select
                        name="numGuests"
                        id="numGuests"
                        defaultValue={currentNumGuests}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                        required
                    >
                        <option value="" key="">
                            Select number of guests...
                        </option>
                        {Array.from(
                            { length: maxCapacity },
                            (_, i) => i + 1
                        ).map((x) => (
                            <option value={x} key={x}>
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="observations">
                        Anything we should know about your stay?
                    </label>
                    <textarea
                        name="observations"
                        defaultValue={currentObservations}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>

                <input type="hidden" name="bookingId" value={bookingId} />

                <div className="flex justify-end items-center gap-6">
                    <SubmitButton>Update Reservation</SubmitButton>
                </div>
            </form>
        </div>
    );
}
