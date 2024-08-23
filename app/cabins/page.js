import CabinCard from "@/app/_components/CabinCard";
import CabinsList from "../_components/CabinsList";
import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";

// Make page dynamic so changes in cabins will show up.
export const revalidate = 3600;

export const metadata = {
    title: "Cabins",
};

export default function Page({ searchParams }) {
    const filter = searchParams?.capacity ?? "all";

    return (
        <div>
            <h1 className="text-4xl mb-5 text-accent-400 font-medium">
                Our Luxury Cabins
            </h1>
            <p className="text-primary-200 text-lg mb-10">
                Cozy yet luxurious cabins, located right in the heart of the
                Italian Dolomites. Imagine waking up to beautiful mountain
                views, spending your days exploring the dark forests around, or
                just relaxing in your private hot tub under the stars. Enjoy
                nature&apos;s beauty in your own little home away from home. The
                perfect spot for a peaceful, calm vacation. Welcome to paradise.
            </p>
            <div className="flex justify-end mb-8">
                <Filter />
            </div>

            {
                // The Suspense needs a key so that it will show the spinner when the key is changed,
                // instead of the default behaviour where it will never show a fallback when rendered
                // content has been rendered, even if it's changed.
            }

            <Suspense fallback={<Spinner />} key={filter}>
                <CabinsList filter={filter} />
            </Suspense>
        </div>
    );
}
