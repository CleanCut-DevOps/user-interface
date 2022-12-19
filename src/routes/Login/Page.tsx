import { FC } from "react";
import {
    Blockquote,
    Box,
    Button,
    Checkbox,
    createStyles,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { Link } from "wouter";

const useStyles = createStyles(theme => ({
    wrapper: {
        height: "100vh",
        padding: "2rem",
        display: "flex",
        gap: "2rem"
    },
    informationPanel: {
        height: "100%",
        color: "white",
        display: "flex",
        padding: "2rem",
        width: "100%",
        maxWidth: "450px",
        borderRadius: "1rem",
        flexDirection: "column",
        backgroundColor: "#3c37ff",
        justifyContent: "space-between",
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            display: "none"
        }
    },
    panelLabel: {
        fontSize: 28,
        fontWeight: 600
    },
    informationCTA: {
        fontSize: 48,
        lineHeight: 1,
        fontWeight: 500
    },
    informationQuote: {
        color: "#e0e0e0",
        padding: "1rem",
        fontSize: "1rem",
        borderRadius: "1rem",
        backgroundColor: "#2520e3"
    },
    formPanel: {
        flex: 1,
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    formContainer: {
        display: "flex",
        minWidth: "560px",
        flexDirection: "column",
        gap: 36
    },
    link: {
        textDecoration: "none",
        color: "#3c37ff",
        fontWeight: 600,
        transition: "all 0.2s ease",
        "&:hover": {
            color: "#2520e3",
            textDecoration: "underline"
        }
    },
    submit: {
        backgroundColor: "#3c37ff",
        color: "white",
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: "#2520e3"
        }
    }
}));

export const Login: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.wrapper}>
            <Box className={classes.informationPanel}>
                <Text className={classes.panelLabel} mt={24}>
                    CleanCut
                </Text>
                <Stack align={"start"} justify={"start"} spacing={36}>
                    <Text className={classes.informationCTA}>
                        Start your journey with us.
                    </Text>
                    <Text size={24} color={"#999"}>
                        Digitalized cleaning services at your fingertips.
                    </Text>
                </Stack>
                <Blockquote
                    mb={32}
                    className={classes.informationQuote}
                    cite="– Forrest Gump">
                    Simply unbelievable how easy it is to interact with
                    CleanCut. I can't wait to see what the future holds for this
                    company.
                </Blockquote>
            </Box>
            <Box className={classes.formPanel}>
                <Box className={classes.formContainer}>
                    <Stack spacing={12}>
                        <Text className={classes.panelLabel}>Login</Text>
                        <Text fw={500} color={"#777"}>
                            Don't have an account?{" "}
                            <Link href={"/register"} className={classes.link}>
                                Register
                            </Link>
                        </Text>
                    </Stack>
                    <Stack spacing={24}>
                        <TextInput
                            size={"md"}
                            label="Email address"
                            placeholder="hello@gmail.com"
                        />
                        <PasswordInput
                            size={"md"}
                            label="Password"
                            placeholder="Your password"
                        />
                        <Group position="apart">
                            <Checkbox
                                size="md"
                                label="Remember me"
                                color="dark"
                            />
                            <Link
                                href={"/resetPassword"}
                                className={classes.link}>
                                Forgot password?
                            </Link>
                        </Group>
                        <Button
                            fullWidth
                            size={"md"}
                            className={classes.submit}
                            color="indigo">
                            Sign in
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
};
