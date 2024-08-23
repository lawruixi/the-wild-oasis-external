import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

export default async function Reservation({ cabin }) {
    // Data is fetched here and not in the Client Components
    // because... they are Client Components. You must fetch
    // data in Server Components like this one.
    const [settings, bookedDates] = await Promise.all([
        getSettings(),
        getBookedDatesByCabinId(cabin.id),
    ]);

    const session = await auth();

    return (
        <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
            <DateSelector
                settings={settings}
                bookedDates={bookedDates}
                cabin={cabin}
            />
            {session?.user != null ? (
                <ReservationForm cabin={cabin} user={session.user}/>
            ) : (
                <LoginMessage />
            )}
        </div>
    );
}
