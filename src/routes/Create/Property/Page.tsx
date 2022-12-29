import { Stack } from "@mantine/core";
import axios from "axios";
import { FC } from "react";
import { PropertyType } from "../../../models";
import { Header } from "./components/Header";
import { PropertyCreationProvider } from "./components/Provider";

const fetchPropertyTypes = async () => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_SERVICE_API}/api/property`
    );

    for (const propertyType of data.propertyTypes) {
        propertyType.created_at = new Date(propertyType.created_at);
        propertyType.updated_at = new Date(propertyType.updated_at);

        for (const roomType of propertyType.rooms) {
            roomType.updated_at = new Date(roomType.updated_at);
        }
    }

    return data as {
        type: string;
        message: string;
        propertyTypes: PropertyType[];
    };
};

export const CreateProperty: FC = () => {
    return (
        <PropertyCreationProvider>
            <Stack>
                <Header />
                <>Hello world</>
            </Stack>
        </PropertyCreationProvider>
    );
};
