import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import ReservationForm from "@/app/_components/ReservationForm";
import ReservationReminder from "@/app/_components/ReservationReminder";
import Spinner from "@/app/_components/Spinner";
import {
    getBookedDatesByCabinId,
    getCabin,
    getCabins,
    getSettings,
} from "@/app/_lib/data-service";
import { max } from "date-fns";
import Image from "next/image";
import { Suspense } from "react";

// PLACEHOLDER DATA
//const cabin = {
//id: 89,
//name: "001",
//maxCapacity: 2,
//regularPrice: 250,
//discount: 0,
//description:
//"Discover the ultimate luxury getaway for couples in the cozy wooden cabin 001. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat. Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and a fully-equipped kitchen. The plush king-size bed, dressed in fine linens guarantees a peaceful nights sleep. Relax in the spa-like shower and unwind on the private deck with hot tub.",
//image:
//"https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg",
//};

export async function generateMetadata({ params }) {
    const { name } = await getCabin(params.cabinId);

    return {
        title: `Cabin ${name}`,
    };
}

// Preferred to dynamic routes for better performance
export async function generateStaticParams() {
    const cabins = await getCabins();
    const ids = cabins.map((cabin) => {
        return {
            cabinId: String(cabin.id),
        };
    });

    // Returns a list of JSON Objects that are of the form:
    // { "dynamic_url_segment": "value" }.
    return ids;
}

export default async function Page({ params }) {
    const cabin = await getCabin(params.cabinId);
    const {
        id,
        name,
        maxCapacity,
        regularPrice,
        discount,
        image,
        description,
    } = cabin;

    // Blocking waterfall; each must await in seqeuence even though
    // they can be done in parallel. Alternative 1 is to await Promise.all(...)
    // and Alternative 2 is to create a new component (Reservation.js here) containing
    // all the data that needs to be fetched, then stream the information over by wrapping
    // it in a Suspense.
    //
    //const settings = await getSettings();
    //const bookedDates = await getBookedDatesByCabinId(cabin.id);

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <Cabin
                image={image}
                name={name}
                description={description}
                maxCapacity={maxCapacity}
            />

            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
                    Reserve {name} today. Pay on arrival.
                </h2>
            </div>

            <Suspense fallback={<Spinner />}>
                <Reservation cabin={cabin} />
                {
                    // <ReservationReminder/>
                }
            </Suspense>
        </div>
    );
}
