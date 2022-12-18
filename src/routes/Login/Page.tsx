import { FC } from "react";
import {
    Anchor,
    Button,
    Checkbox,
    createStyles,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import imgURL from "../../../public/images/mesh-gradient.png";

const useStyles = createStyles(theme => ({
    wrapper: {
        maxWidth: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden"
    },
    imageBg: {
        flex: 1,
        objectFit: "cover",
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            display: "none"
        }
    },
    sidebar: {
        minWidth: 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    columnGroup: {
        gap: 4,
        width: "100%",
        alignItems: "start",
        flexDirection: "column"
    },
    inputFields: {
        gap: 4,
        display: "flex",
        flexDirection: "column",
        width: "100%"
    }
}));

export const Login: FC = () => {
    const { classes } = useStyles();
    return (
        <main className={classes.wrapper}>
            <Paper className={classes.sidebar} radius={"md"} p={30}>
                <Group className={classes.columnGroup} mb={40}>
                    <Title>Welcome back 👋</Title>
                    <Text color={"#9a9a9a"}>Please enter your details.</Text>
                </Group>
                <Group className={classes.columnGroup} mb={40}>
                    <TextInput
                        label="Email address"
                        placeholder="hello@gmail.com"
                        size={"lg"}
                        radius={"md"}
                        mb={20}
                        className={classes.inputFields}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        size={"lg"}
                        radius={"md"}
                        className={classes.inputFields}
                    />
                </Group>
                <Checkbox label="Keep me logged in" size="md" />
                <Button fullWidth mt={24} size="md">
                    Login
                </Button>

                <Text align="center" mt="md">
                    Don&apos;t have an account?{" "}
                    <Anchor<"a">
                        href="#"
                        weight={700}
                        onClick={event => event.preventDefault()}>
                        Register
                    </Anchor>
                </Text>
            </Paper>
            <img
                src={imgURL}
                className={classes.imageBg}
                alt={"Mesh gradient background image"}
            />
        </main>
    );
};
