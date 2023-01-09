import { Accordion, createStyles, ScrollArea, Stepper, Text } from "@mantine/core";
import { FC, useContext, useEffect, useState } from "react";
import { TbBed, TbBuilding, TbListDetails, TbMapPin } from "react-icons/tb";
import { Property } from "../../../../../models";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        height: "100%",
        overflow: "hidden",
        transition: "0.4s ease",
        padding: theme.spacing.xl
    }
}));

export const Sidebar: FC = () => {
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
        <ScrollArea className={classes.wrapper}>
            <Accordion w={"100%"} value={value} radius={"md"} variant={"contained"} onChange={handleChange}>
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
                    <Accordion.Control fz={"sm"} icon={<TbBuilding />}>
                        <Text fw={600}>Type</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            What kind of building it is
                        </Text>
                    </Accordion.Control>
                    <Accordion.Panel></Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"3"}>
                    <Accordion.Control fz={"sm"} icon={<TbBed />}>
                        <Text fw={600}>Rooms</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            What type of rooms are in it and how many are there
                        </Text>
                    </Accordion.Control>
                    <Accordion.Panel></Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"4"}>
                    <Accordion.Control fz={"sm"} icon={<TbListDetails />}>
                        <Text fw={600}>Additional Details</Text>
                        <Text fw={400} fz={"xs"} color={"dimmed"}>
                            Other additional information
                        </Text>
                    </Accordion.Control>
                    <Accordion.Panel></Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </ScrollArea>
    );
};

const DetailStepper: FC<{ property: Property | null }> = ({ property }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (property) {
            if (property.icon && property.label && property.description && property.images.length > 0) {
                setStep(4);
            } else if (property.icon && property.label && property.description) setStep(3);
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
            <Stepper.Step style={{ alignItems: "center" }} label="Postal Code" />
        </Stepper>
    );
};
