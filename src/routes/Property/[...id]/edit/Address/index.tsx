import { createStyles, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { FC, ReactNode, useContext } from "react";
import { EditPropertyContext } from "../components";

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

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: 4 }
    },
    scrollArea: {
        width: "100%",
        height: "100%",
        maxWidth: "768px",
        overflowX: "hidden",
        padding: theme.spacing.xs
    },
    labels: {
        gap: 4,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",

        [`@media (max-width: 815px)`]: {
            width: "100%",
            alignItems: "flex-start"
        }
    },
    title: {
        fontSize: 32,
        fontWeight: 700,

        [`@media (max-width: 815px)`]: { fontSize: 24 }
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,

        [`@media (max-width: 815px)`]: { fontSize: 14 }
    }
}));

export const Address: FC = () => {
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    return (
        <div className={classes.wrapper}>
            <div className={classes.labels}>
                <Text className={classes.title}>Where your property is located</Text>
                <Text className={classes.subtitle} color={"dimmed"}>
                    This information will be used for our cleaners and yourself.
                </Text>
            </div>
            <Grid mt={"md"} maw={768} columns={11} grow>
                <Row req label={"Line 1"}>
                    <TextInput
                        value={property?.address.line_1 ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { line_1: e.target.value } })}
                    />
                </Row>
                <Row label={"Line 2"}>
                    <TextInput
                        value={property?.address.line_2 ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { line_2: e.target.value } })}
                    />
                </Row>
                <Row req label={"City"}>
                    <TextInput
                        value={property?.address.city ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { city: e.target.value } })}
                    />
                </Row>
                <Row label={"State"}>
                    <TextInput
                        value={property?.address.state ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { state: e.target.value } })}
                    />
                </Row>
                <Row req label={"Zip"}>
                    <TextInput
                        value={property?.address.zip ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { zip: e.target.value } })}
                    />
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
            <Grid.Col span={3} sx={{ [`@media (max-width: 815px)`]: { display: "none" } }}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>
                <Stack spacing={4}>
                    <Title order={6} sx={{ [`@media (min-width: 815px)`]: { display: "none" } }}>
                        {label} {req && <span style={{ color: "red" }}>*</span>}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
