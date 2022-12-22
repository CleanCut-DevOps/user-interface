import { FC } from "react";
import { createStyles, Paper } from "@mantine/core";
import { InformationPanel } from "./components/InfoPanel";
import { FormPanel } from "./components/FormPanel";

const useStyles = createStyles(() => ({
    wrapper: {
        height: "100vh",
        padding: "1.5rem",
        display: "flex",
        gap: "1.5rem"
    }
}));

export const Register: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.wrapper}>
            <InformationPanel />
            <FormPanel />
        </Paper>
    );
};