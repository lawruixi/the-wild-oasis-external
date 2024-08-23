"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter() {
    // This whole component can basically be reused as a recipe; the formula for
    // reading searchparams and setting searchparams is always the same.
    //
    // For client components, must use this way;
    // server compoennts can just take the searchParams prop.
    const searchParams = useSearchParams();
    const router = useRouter(); // Used for navigation to another route programmatically.
    const pathname = usePathname();

    const activeFilter = searchParams.get("capacity") ?? "all";

    function handleFilter(filter) {
        // Not from next.js, but a generic web API.
        // Used to manage SearchParams.
        const params = new URLSearchParams(searchParams);
        params.set("capacity", filter);

        // Need to construct the whole URL here, which is why we needed pathname.
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="border border-primary-800 flex">
            <Button
                filter="all"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                All cabins
            </Button>
            <Button
                filter="small"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                1&mdash;3 guests
            </Button>
            <Button
                filter="medium"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                4&mdash;7 guests
            </Button>
            <Button
                filter="large"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                8&mdash;12 guests
            </Button>
        </div>
    );
}

function Button({ filter, handleFilter, activeFilter, children }) {
    return (
        <button
            className={`px-5 py-2 hover:bg-primary-700 ${
                filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
            }`}
            onClick={() => handleFilter(filter)}
        >
            {children}
        </button>
    );
}
