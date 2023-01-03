import { Accordion, createStyles, Navbar, Stepper, Text } from "@mantine/core";
import { FC, useContext, useEffect, useState } from "react";
import { TbBed, TbBuilding, TbListDetails, TbMapPin } from "react-icons/tb";
import { Property } from "../../../../../models";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        display: "flex",
        alignItems: "center",
        transition: "0.4s ease",
        flexDirection: "column",
        justifyContent: "center",
        padding: theme.spacing.xl
    }
}));

export const Sidebar: FC = () => {
    const { classes } = useStyles();
    const { property, setStep } = useContext(EditPropertyContext);

    const determineDetailStep = (): number => {
        if (property?.label && property?.description && property?.images)
            return 2;
        else if (property?.label && property?.description) return 1;
        else if (property?.label) return 0;

        return 0;
    };

    const determineAddressStep = (): number => {
        return 0;
    };

    const determineAdditionalStep = (): number => {
        return 0;
    };

    return (
        <Navbar className={classes.wrapper} width={{ base: 360 }}>
            <Accordion w={"100%"} variant="contained" radius={"md"}>
                <Accordion.Item
                    value={"Property Details"}
                    onClick={() => setStep(0)}
                >
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
                <Accordion.Item value={"Address"} onClick={() => setStep(1)}>
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
                <Accordion.Item value={"Type"} onClick={() => setStep(2)}>
                    <Accordion.Control fz={"sm"} icon={<TbBuilding />}>
                        <Text fw={600}>Type</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            What kind of building it is
                        </Text>
                    </Accordion.Control>
                </Accordion.Item>
                <Accordion.Item value={"Rooms"} onClick={() => setStep(3)}>
                    <Accordion.Control fz={"sm"} icon={<TbBed />}>
                        <Text fw={600}>Rooms</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            What type of rooms are in it and how many are there
                        </Text>
                    </Accordion.Control>
                </Accordion.Item>
                <Accordion.Item
                    value={"Additional Details"}
                    onClick={() => setStep(4)}
                >
                    <Accordion.Control fz={"sm"} icon={<TbListDetails />}>
                        <Text fw={600}>Additional Details</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            Other additional information
                        </Text>
                    </Accordion.Control>
                </Accordion.Item>
            </Accordion>
        </Navbar>
    );
};

const DetailStepper: FC<{ property: Property | null }> = ({ property }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (property) {
            if (
                property.label &&
                property.description &&
                property.images.length > 0 &&
                property.icon
            ) {
                setStep(4);
            } else if (
                property.label &&
                property.description &&
                property.images.length > 0
            )
                setStep(3);
            else if (property.label && property.description) setStep(2);
            else if (property.label) setStep(1);
            else setStep(0);
        } else setStep(0);
    }, [property]);

    return (
        <Stepper
            size={"xs"}
            radius={"md"}
            active={step}
            color={"indigo"}
            orientation={"vertical"}
        >
            <Stepper.Step
                label="Label"
                description="Name the property for yourself"
            />
            <Stepper.Step
                label="Description"
                description="Give a short description of the property"
            />
            <Stepper.Step
                label="Images"
                description="Provide some pictures of the property"
            />
            <Stepper.Step
                label="Identifier"
                description="Give the property a unique identifier"
            />
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
                property.address.postal_code
            ) {
                setStep(5);
            } else if (
                property.address.line_1 &&
                property.address.line_2 &&
                property.address.city &&
                property.address.state
            ) {
                setStep(4);
            } else if (
                property.address.line_1 &&
                property.address.line_2 &&
                property.address.city
            ) {
                setStep(3);
            } else if (property.address.line_1 && property.address.line_2) {
                setStep(2);
            } else if (property.address.line_1) {
                setStep(1);
            } else setStep(0);
        } else setStep(0);
    }, [property]);

    return (
        <Stepper
            size={"xs"}
            radius={"md"}
            active={step}
            color={"indigo"}
            orientation={"vertical"}
        >
            <Stepper.Step style={{ alignItems: "center" }} label="Line 1" />
            <Stepper.Step style={{ alignItems: "center" }} label="Line 2" />
            <Stepper.Step style={{ alignItems: "center" }} label="City" />
            <Stepper.Step style={{ alignItems: "center" }} label="State" />
            <Stepper.Step
                style={{ alignItems: "center" }}
                label="Postal Code"
            />
        </Stepper>
    );
};
