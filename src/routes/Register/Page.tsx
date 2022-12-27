import { Center, createStyles, Stack } from "@mantine/core";
import { FC } from "react";
import { Form } from "./components/Form";
import { Header } from "./components/Header";

const useStyles = createStyles(theme => ({
    wrapper: {
        gap: 0,
        width: "100%",
        height: "100%",
        minWidth: "100vw",
        minHeight: "100vh",
        justifyContent: "flex-start",
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0]
    },
    centered: {
        flex: 1,
        position: "relative",
        padding: "1rem"
    }
}));

export const Register: FC = () => {
    const { classes } = useStyles();
    return (
        <Stack className={classes.wrapper}>
            <Header />
            <Center className={classes.centered}>
                <Form />
            </Center>
        </Stack>
    );
};
