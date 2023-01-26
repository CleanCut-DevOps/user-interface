import { createStyles, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

import axios from "axios";
import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { EditPropertyContext } from "../../components/PropertyProvider";

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column",
        padding: theme.spacing.lg,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: theme.spacing.xs }
    },
    scrollArea: {
        width: "100%",
        height: "100%",
        maxWidth: "768px",
        overflowX: "hidden",
        padding: theme.spacing.xs
    },
    labels: {
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: 2 * theme.spacing.xs
    },
    step: {
        fontSize: 16,
        fontWeight: 500
    },
    title: {
        fontSize: 32,
        fontWeight: 700,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 24 }
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 14 }
    }
}));

export const Address: FC = () => {
    const { classes } = useStyles();
    const [loaded, setLoaded] = useState(false);
    const [cookies] = useCookies(["AccessToken"]);
    const { property, dispatch } = useContext(EditPropertyContext);

    // input values
    const [line_1, setLine_1] = useState(property?.address.line_1 ?? "");
    const [line_2, setLine_2] = useState(property?.address.line_2 ?? "");
    const [city, setCity] = useState(property?.address.city ?? "");
    const [state, setState] = useState(property?.address.state ?? "");
    const [zip, setZip] = useState(property?.address.zip ?? "");

    // debounced values
    const [debouncedLine_1] = useDebouncedValue(line_1, 500);
    const [debouncedLine_2] = useDebouncedValue(line_2, 500);
    const [debouncedCity] = useDebouncedValue(city, 500);
    const [debouncedState] = useDebouncedValue(state, 500);
    const [debouncedZip] = useDebouncedValue(zip, 500);

    useEffect(() => {
        if (!loaded) setLoaded(true);
    }, [debouncedLine_1, debouncedLine_2, debouncedCity, debouncedState, debouncedZip]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/address`,
                { line_1: debouncedLine_1 },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedLine_1]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/address`,
                { line_2: debouncedLine_2 },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedLine_2]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/address`,
                { city: debouncedCity },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedCity]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/address`,
                { state: debouncedState },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedState]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}/address`,
                { zip: debouncedZip },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedZip]);

    const handleLine1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLine_1(e.target.value);

        dispatch({ type: "address", payload: { line_1: e.target.value } });
    };

    const handleLine2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLine_2(e.target.value);

        dispatch({ type: "address", payload: { line_2: e.target.value } });
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);

        dispatch({ type: "address", payload: { city: e.target.value } });
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);

        dispatch({ type: "address", payload: { state: e.target.value } });
    };

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZip(e.target.value);

        dispatch({ type: "address", payload: { zip: e.target.value } });
    };

    return (
        <div className={classes.wrapper}>
            <Grid mt={"md"} maw={768} columns={11} grow>
                <Grid.Col span={11} className={classes.labels}>
                    <Title className={classes.step}>Step 2</Title>
                    <Title className={classes.title}>Let us find our way</Title>
                    <Text className={classes.subtitle} color={"dimmed"}>
                        This address will be used by our cleaners to find your property. It will not be shared with
                        anyone.
                    </Text>
                </Grid.Col>
                <Row req label={"Line 1"}>
                    <TextInput value={property?.address.line_1 ?? ""} onChange={handleLine1Change} />
                </Row>
                <Row label={"Line 2"}>
                    <TextInput value={property?.address.line_2 ?? ""} onChange={handleLine2Change} />
                </Row>
                <Row req label={"City"}>
                    <TextInput value={property?.address.city ?? ""} onChange={handleCityChange} />
                </Row>
                <Row label={"State"}>
                    <TextInput value={property?.address.state ?? ""} onChange={handleStateChange} />
                </Row>
                <Row req label={"Zip"}>
                    <TextInput value={property?.address.zip ?? ""} onChange={handleZipChange} />
                </Row>
            </Grid>
        </div>
    );
};

type RowProps = {
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ label, req, children }) => {
    return (
        <>
            <Grid.Col
                span={3}
                sx={theme => ({ [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "none" } })}
            >
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>
                <Stack spacing={4}>
                    <Title
                        order={6}
                        sx={theme => ({
                            display: "none",
                            [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "block" }
                        })}
                    >
                        {label} {req && <span style={{ color: "red" }}>*</span>}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
