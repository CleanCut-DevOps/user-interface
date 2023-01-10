import { createStyles, Grid, ScrollArea, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, ReactNode, useContext, useEffect, useReducer } from "react";
import { EditPropertyContext } from "../components";

type ReducerAction = {
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    zip?: string;
};

type ReducerState = {
    line_1: string | null;
    line_2: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
};

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

const reducer = (state: ReducerState, action: ReducerAction) => {
    return { ...state, ...action };
};

export const Address: FC = () => {
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);
    const [state, localDispatch] = useReducer(reducer, {
        ...{ line_1: null, line_2: null, city: null, state: null, zip: null },
        ...property?.address
    });

    const [addressDebounced] = useDebouncedValue(state, 2000);

    useEffect(() => {
        dispatch({
            type: "address",
            payload: state
        });
    }, [addressDebounced]);

    return (
        <div className={classes.wrapper}>
            <Title>Where your property is located</Title>
            <Text color={"dimmed"}>This information will be used for our cleaners and yourself.</Text>
            <div className={classes.container}>
                <Grid w={"100%"} columns={11}>
                    <Row req label={"Line 1"}>
                        <TextInput
                            value={state.line_1 ?? ""}
                            onChange={e => localDispatch({ line_1: e.target.value })}
                        />
                    </Row>
                    <Row req label={"Line 2"}>
                        <TextInput
                            value={state.line_2 ?? ""}
                            onChange={e => localDispatch({ line_2: e.target.value })}
                        />
                    </Row>
                    <Row label={"City"}>
                        <TextInput value={state.city ?? ""} onChange={e => localDispatch({ city: e.target.value })} />
                    </Row>
                    <Row label={"State"}>
                        <TextInput value={state.state ?? ""} onChange={e => localDispatch({ state: e.target.value })} />
                    </Row>
                    <Row label={"Zip"}>
                        <TextInput value={state.zip ?? ""} onChange={e => localDispatch({ zip: e.target.value })} />
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
