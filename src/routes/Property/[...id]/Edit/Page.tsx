import { AppShell, ScrollArea } from "@mantine/core";

import { FC, useContext, useEffect } from "react";
import useSWR from "swr";
import { useLocation } from "wouter";

import { AuthWrapper, Loading } from "~/components";
import { fetcher } from "~/hooks";

import { EditPropertyContext, EditPropertyProvider } from "../components/PropertyProvider";
import { Address } from "./components/Address";
import { EditAside } from "./components/Aside";
import { Details } from "./components/Details";
import { EditHeader } from "./components/Header";
import { Type } from "./components/Types";

type ComponentProps = { params: { id: string } };

export const EditProperty: FC<ComponentProps> = ({ params: { id } }) => {
    return (
        <AuthWrapper requireAuth>
            <EditPropertyProvider id={id}>
                <AppShell
                    padding={0}
                    header={<EditHeader />}
                    aside={<EditAside />}
                    asideOffsetBreakpoint="md"
                    styles={{ main: { height: "100vh", overflow: "hidden" } }}
                >
                    <GetEditableContent />
                </AppShell>
            </EditPropertyProvider>
        </AuthWrapper>
    );
};

export const GetEditableContent: FC = () => {
    const [, setLocation] = useLocation();
    const { step } = useContext(EditPropertyContext);
    const { data, isLoading, error } = useSWR(
        `${import.meta.env.VITE_PROPERTY_API}/type/property?withRooms=true`,
        fetcher
    );

    useEffect(() => {
        if (error) setLocation("/");
    }, [error]);

    switch (step) {
        case 0:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <Details />
                </ScrollArea>
            );
        case 1:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <Address />
                </ScrollArea>
            );
        case 2:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <Type
                        pType={{
                            data: data.propertyTypes ?? [],
                            isLoading,
                            error
                        }}
                    />
                </ScrollArea>
            );

        default:
            return <Loading withHeader={false} />;
    }
};
