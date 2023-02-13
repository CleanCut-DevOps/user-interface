import { FC, useState } from "react";

type FilterOptions = {
    propertyID?: string;
};

export const BookingCollection: FC = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        propertyID: queryParams.get("property")?.toString()
    });

    return (
        <div>
            <div>Booking Collection</div>
            <div>Property: {filterOptions.propertyID}</div>
        </div>
    );
};
