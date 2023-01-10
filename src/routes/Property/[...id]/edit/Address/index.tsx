import { createStyles, Grid, Text, TextInput, Title } from "@mantine/core";
import { FC, ReactNode, useContext } from "react";
import { EditPropertyContext } from "../components";

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column"
    },
    container: {
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        maxWidth: theme.breakpoints.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    },
    scrollArea: {
        width: "100%",
        height: "100%",
        maxWidth: "768px",
        overflowX: "hidden",
        padding: theme.spacing.xs
    }
}));

export const Address: FC = () => {
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    return (
        <div className={classes.wrapper}>
            <Title>Where your property is located</Title>
            <Text color={"dimmed"}>This information will be used for our cleaners and yourself.</Text>
            <div className={classes.container}>
                <Grid w={"100%"} columns={11}>
                    <Row req label={"Line 1"}>
                        <TextInput
                            value={property?.address.line_1 ?? ""}
                            onChange={e => dispatch({ type: "address", payload: { line_1: e.target.value } })}
                        />
                    </Row>
                    <Row req label={"Line 2"}>
                        <TextInput
                            value={property?.address.line_2 ?? ""}
                            onChange={e => dispatch({ type: "address", payload: { line_2: e.target.value } })}
                        />
                    </Row>
                    <Row label={"City"}>
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
                    <Row label={"Zip"}>
                        <TextInput
                            value={property?.address.zip ?? ""}
                            onChange={e => dispatch({ type: "address", payload: { zip: e.target.value } })}
                        />
                    </Row>
                </Grid>
            </div>
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
            <Grid.Col span={3}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>{children}</Grid.Col>
        </>
    );
};
