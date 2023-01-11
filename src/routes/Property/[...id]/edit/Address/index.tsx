import { createStyles, Grid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
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
        flexDirection: "column"
    },
    resLabel: {
        width: "100%",
        alignItems: "flex-start"
    }
}));

export const Address: FC = () => {
    const { classes } = useStyles();
    const { width } = useViewportSize();
    const { property, dispatch } = useContext(EditPropertyContext);

    return (
        <div className={classes.wrapper}>
            <div className={`${classes.labels} ${width < 816 && classes.resLabel}`}>
                <Title order={width > 815 ? 1 : 3}>Where your property is located</Title>
                <Text size={width > 815 ? "md" : "sm"} color={"dimmed"}>
                    This information will be used for our cleaners and yourself.
                </Text>
            </div>
            <Grid mt={"md"} maw={768} columns={11}>
                <Row w={width} req label={"Line 1"}>
                    <TextInput
                        value={property?.address.line_1 ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { line_1: e.target.value } })}
                    />
                </Row>
                <Row w={width} label={"Line 2"}>
                    <TextInput
                        value={property?.address.line_2 ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { line_2: e.target.value } })}
                    />
                </Row>
                <Row w={width} req label={"City"}>
                    <TextInput
                        value={property?.address.city ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { city: e.target.value } })}
                    />
                </Row>
                <Row w={width} label={"State"}>
                    <TextInput
                        value={property?.address.state ?? ""}
                        onChange={e => dispatch({ type: "address", payload: { state: e.target.value } })}
                    />
                </Row>
                <Row w={width} req label={"Zip"}>
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
    w: number;
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ w, label, req, children }) => {
    return (
        <>
            <Grid.Col span={3} style={{ display: w > 815 ? "block" : "none" }}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={w > 815 ? 8 : 11}>
                <Stack spacing={4}>
                    <Title order={6} style={{ display: w > 815 ? "none" : "block" }}>
                        {label} {req && <span style={{ color: "red" }}>*</span>}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
