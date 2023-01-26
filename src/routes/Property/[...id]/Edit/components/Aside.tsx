import { Accordion, Aside, createStyles, Divider, Group, ScrollArea, Stack, Stepper, Text } from "@mantine/core";

import { FC, useContext, useEffect, useState } from "react";
import { TbBuilding, TbListDetails, TbMapPin } from "react-icons/tb";

import { Property } from "~/models";

import { EditPropertyContext } from "../../components/PropertyProvider";

const useStyles = createStyles(theme => ({
    wrapper: {
        maxWidth: 400,
        height: "100%",
        overflow: "hidden",
        transition: "0.4s ease",
        paddingInline: theme.spacing.xl,

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            display: "none"
        }
    }
}));

export const EditAside: FC = () => {
    const { classes } = useStyles();
    const [value, setValue] = useState<string>("0");
    const { step, property, dispatch } = useContext(EditPropertyContext);

    useEffect(() => setValue(step.toString()), [step]);

    const handleChange = (newValue: string | null) => {
        if (newValue && parseInt(newValue) != step) {
            dispatch({ type: "setStep", payload: parseInt(newValue) });
        }
    };

    return (
        <Aside p={0} hiddenBreakpoint="md" hidden width={{ base: 1, md: 400 }} withBorder={false}>
            <ScrollArea h="100%" scrollbarSize={6}>
                <Accordion p="md" value={step.toString()} radius="md" variant="contained" onChange={handleChange}>
                    <Accordion.Item value={"0"}>
                        <Accordion.Control fz={"sm"} icon={<TbListDetails />}>
                            <Text fw={600}>Property Details</Text>
                            <Text fw={400} fz={"xs"} color={"dimmed"}>
                                Basic information about your property
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <DetailStepper property={property} />
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={"1"}>
                        <Accordion.Control fz={"sm"} icon={<TbMapPin />}>
                            <Text fw={600}>Address</Text>
                            <Text fw={400} fz={"xs"} color={"dimmed"}>
                                Help our cleaners get to it
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <AddressStepper property={property} />
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={"2"}>
                        <Accordion.Control fz="sm" icon={<TbBuilding />}>
                            <Text fw={500}>Type</Text>
                            <Text fw={400} fz={"xs"} color={"dimmed"}>
                                What kind of building it is and what type of rooms are in it and how many are there
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {property?.type ? (
                                <Stack spacing="sm">
                                    <Text mb="sm" size="md" fw={600}>
                                        {property?.type.label}
                                    </Text>
                                    {property?.rooms.map((room, i) => (
                                        <Group key={i} mt={2} position="apart">
                                            <Text size="sm">
                                                {room.quantity} {room.type.label.toLocaleLowerCase()}
                                                {room.quantity != 1 ? "s" : ""}
                                            </Text>
                                            <Text size="xs" color="dimmed" fw={400}>
                                                ${room.type.price.toFixed(2)} / unit
                                            </Text>
                                        </Group>
                                    ))}
                                    <Divider />
                                    <Group position="apart">
                                        <Text size="sm">Base Price</Text>
                                        <Text fw={500}>
                                            $
                                            {property.rooms
                                                .sort((a, b) => a.type.label.localeCompare(b.type.label))
                                                .map(room => room.quantity * room.type.price)
                                                .reduce((partialSum, a) => partialSum + a, 0)
                                                .toFixed(2)}
                                        </Text>
                                    </Group>
                                </Stack>
                            ) : (
                                <Text size={"xs"} color={"dimmed"}>
                                    No type selected
                                </Text>
                            )}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </ScrollArea>
        </Aside>
    );
};

const DetailStepper: FC<{ property: Property | null }> = ({ property }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (property) {
            if (property.icon && property.label && property.description && property.images.length > 0) setStep(4);
            else if (property.icon && property.label && property.description) setStep(3);
            else if (property.icon && property.label) setStep(2);
            else if (property.icon) setStep(1);
            else setStep(0);
        } else setStep(0);
    }, [property]);

    return (
        <Stepper size={"xs"} radius={"md"} active={step} color={"indigo"} orientation={"vertical"}>
            <Stepper.Step label="Identifier" description="Give the property a unique identifier" />
            <Stepper.Step label="Label" description="Name the property for yourself" />
            <Stepper.Step label="Description" description="Give a short description of the property" />
            <Stepper.Step label="Images" description="Provide some pictures of the property" />
        </Stepper>
    );
};

const AddressStepper: FC<{ property: Property | null }> = ({ property }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (property && property.address) {
            if (
                property.address.line_1 &&
                property.address.line_2 &&
                property.address.city &&
                property.address.state &&
                property.address.zip
            ) {
                setStep(5);
            } else if (
                property.address.line_1 &&
                property.address.line_2 &&
                property.address.city &&
                property.address.state
            ) {
                setStep(4);
            } else if (property.address.line_1 && property.address.line_2 && property.address.city) {
                setStep(3);
            } else if (property.address.line_1 && property.address.line_2) {
                setStep(2);
            } else if (property.address.line_1) {
                setStep(1);
            } else setStep(0);
        } else setStep(0);
    }, [property]);

    return (
        <Stepper size={"xs"} radius={"md"} active={step} color={"indigo"} orientation={"vertical"}>
            <Stepper.Step style={{ alignItems: "center" }} label="Line 1" />
            <Stepper.Step style={{ alignItems: "center" }} label="Line 2" />
            <Stepper.Step style={{ alignItems: "center" }} label="City" />
            <Stepper.Step style={{ alignItems: "center" }} label="State" />
            <Stepper.Step style={{ alignItems: "center" }} label="Zip Code" />
        </Stepper>
    );
};
