import { FC } from "react";
import { createStyles, Paper } from "@mantine/core";
import { InformationPanel } from "./components/InfoPanel";
import { FormPanel } from "./components/FormPanel";

const useStyles = createStyles(() => ({
    wrapper: {
        height: "100vh",
        padding: "2rem",
        display: "flex",
        gap: "2rem"
    }
}));

export const Login: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.wrapper}>
            <InformationPanel />
            <FormPanel />
        </Paper>
    );
};
