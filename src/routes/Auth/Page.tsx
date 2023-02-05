import { Anchor, Button, Center, createStyles, Divider, Paper, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "wouter";

import { AuthWrapper, GoogleButton } from "~/components";

import { LoginFields, RegisterFields } from "./components/Fields";

interface ComponentProps {
    type: "register" | "login";
}

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1
    },
    paper: {
        width: "100%",
        maxWidth: 380,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.xs,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            border: 0
        }
    }
}));

export const Auth: FC<ComponentProps> = ({ type }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);
    const [, setCookie] = useCookies(["AccessToken"]);

    const regForm = useForm({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: ""
        },

        validate: {
            email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            name: val => (val.length < 3 ? "Name should include at least 3 characters" : null),
            phone: val => (val.length < 8 ? "Phone number should include at least 8 characters" : null),
            password: val =>
                val.length < 8
                    ? "Password should include at least 8 characters"
                    : !/[a-z]/.test(val)
                    ? "Password should include at least 1 lowercase letter"
                    : !/[A-Z]/.test(val)
                    ? "Password should include at least 1 uppercase letter"
                    : !/[0-9]/.test(val)
                    ? "Password should include at least 1 number"
                    : null
        }
    });

    const handleRegSubmit = regForm.onSubmit(async ({ name, email, phone, password }) => {
        setLoading(true);

        let fData = {
            name,
            email,
            phone,
            password
        };

        await axios
            .post(`${import.meta.env.VITE_ACCOUNT_API}/user/register`, fData)
            .then(({ data }) => {
                setCookie("AccessToken", data.token, { secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });

                showNotification({ title: data.type, message: data.message, color: "green" });

                setLocation("/verify-email");
            })
            .catch(({ response: { data } }) => {
                const { type, message, errors } = data;

                Object.entries(errors).forEach(([key, value]) => {
                    regForm.setFieldError(key, value as string);
                });

                showNotification({ message, color: "red", title: `🚩 ${type}` });

                setLoading(false);
            });
    });

    const loginForm = useForm({
        initialValues: {
            email: "",
            password: "",
            remember: false
        },

        validate: {
            email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: val => (val.length < 8 ? "Password should include at least 8 characters" : null)
        }
    });

    const handleLoginSubmit = loginForm.onSubmit(async ({ email, password, remember }) => {
        setLoading(true);

        let fData = { email, password, remember };

        await axios
            .post(`${import.meta.env.VITE_ACCOUNT_API}/user/login`, fData)
            .then(({ data }) => {
                setCookie("AccessToken", data.token, {
                    secure: true,
                    sameSite: "strict",
                    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24
                });

                showNotification({ title: data.type, message: data.message, color: "green" });

                setLocation("/");
            })
            .catch(({ response: { status } }) => {
                if (status == 422) setLocation("/verify-email");
                else {
                    loginForm.setErrors({ email: "Incorrect email or password" });

                    showNotification({
                        title: "🚩 Couldn't log in",
                        message: "Incorrect email or password",
                        color: "red"
                    });

                    setLoading(false);
                }
            });
    });

    const handleGoogle = () => {
        showNotification({
            id: "google",
            title: "🚧 Under construction",
            message: "This feature is not available yet",
            color: "yellow"
        });
    };

    return (
        <AuthWrapper>
            <Center className={classes.wrapper}>
                <Paper className={classes.paper} withBorder>
                    <Text size="md" weight={600}>
                        {type == "login" && "Log in"}
                        {type == "register" && "Sign up"}
                    </Text>
                    <Text mt={4} size="xs" color="dimmed">
                        By continuing, you agree to our{" "}
                        <Anchor component={Link} href="/policies#agreement">
                            User Agreement
                        </Anchor>{" "}
                        and{" "}
                        <Anchor component={Link} href="/policies#privacy">
                            Privacy Policy
                        </Anchor>
                        .
                    </Text>

                    <GoogleButton my="lg" w="100%" radius="sm" onClick={handleGoogle}>
                        <Text weight={500}>Continue with Google</Text>
                    </GoogleButton>

                    <Divider label="Or" labelPosition="center" />

                    <form onSubmit={type == "login" ? handleLoginSubmit : handleRegSubmit}>
                        <Stack my="lg">
                            {type == "login" ? (
                                <LoginFields
                                    credP={loginForm.getInputProps("email")}
                                    rememberP={loginForm.getInputProps("remember")}
                                    passwordP={loginForm.getInputProps("password")}
                                />
                            ) : (
                                <RegisterFields
                                    nameP={regForm.getInputProps("name")}
                                    emailP={regForm.getInputProps("email")}
                                    numberP={regForm.getInputProps("phone")}
                                    passwordP={regForm.getInputProps("password")}
                                />
                            )}
                        </Stack>

                        <Button w="100%" type="submit" loading={loading}>
                            {type.toLocaleUpperCase()}
                        </Button>
                    </form>

                    <Text mt="sm" size="sm" color="dimmed">
                        {type == "login" ? "New to CleanCut?" : "Already have an account?"}{" "}
                        <Anchor onClick={() => setLocation(type == "login" ? "/register" : "/login")}>
                            {type == "login" ? "Sign up" : "Log in"}
                        </Anchor>
                    </Text>
                </Paper>
            </Center>
        </AuthWrapper>
    );
};
