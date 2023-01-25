import { AppShell, ScrollArea } from "@mantine/core";

import { FC, useContext } from "react";

import { AuthWrapper, Loading } from "~/components";

import { EditPropertyContext, EditPropertyProvider } from "../components/PropertyProvider";
import { EditAside } from "./components/Aside";
import { EditHeader } from "./components/Header";

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
    const { step } = useContext(EditPropertyContext);

    switch (step) {
        case 0:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <div>Step 1</div>
                </ScrollArea>
            );
        case 1:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <div>Step 2</div>
                </ScrollArea>
            );
        case 2:
            return (
                <ScrollArea h="100%" scrollbarSize={6}>
                    <div>Step 3</div>
                </ScrollArea>
            );

        default:
            return <Loading withHeader={false} />;
    }
};
