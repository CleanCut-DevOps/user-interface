import { Anchor, Button, Center, createStyles, Divider, Paper, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";
import { AuthWrapper, GoogleButton } from "~/components";
import { LoginFields, RegisterFields } from "./components/Fields";

interface ComponentProps {
    type: "register" | "login";
}

const useStyles = createStyles(theme => ({
    wrapper: {
        padding: theme.spacing.sm,

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            marginTop: theme.spacing.xl * 2
        }
    },
    paper: {
        width: "100%",
        maxWidth: 380,
        padding: theme.spacing.lg,
        borderRadius: theme.radius.sm,

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            borderRadius: theme.radius.md
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
            email: "",
            password: "",
            full_name: "",
            phone_number: ""
        },

        validate: {
            email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            full_name: val => (val.length < 3 ? "Name should include at least 3 characters" : null),
            phone_number: val => (val.length < 8 ? "Phone number should include at least 8 characters" : null),
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

    const handleRegSubmit = regForm.onSubmit(({ email, full_name, phone_number, password }) => {
        setLoading(true);

        let fData = {
            email,
            password,
            full_name,
            phone_number
        };

        axios
            .post(`${import.meta.env.VITE_ACCOUNT_API}/register`, fData)
            .then(({ data }) => {
                const token = data.token;

                setCookie("AccessToken", token, { secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 * 7 });

                showNotification({ title: data.type, message: data.message, color: "green" });
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
            stay: false,
            password: ""
        },

        validate: {
            email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
            password: val => (val.length < 8 ? "Password should include at least 8 characters" : null)
        }
    });

    const handleLoginSubmit = loginForm.onSubmit(async ({ email, password, stay }) => {
        setLoading(true);

        let fData = { email, password, stay };

        await axios
            .post(`${import.meta.env.VITE_ACCOUNT_API}/login`, fData)
            .then(({ data }) => {
                setCookie("AccessToken", data.token, { secure: true, sameSite: "strict" });

                showNotification({ title: data.type, message: data.message, color: "green" });
            })
            .catch(() => {
                loginForm.setErrors({ email: "Incorrect email or password" });

                setLoading(false);
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
                        By continuing, you agree to our <Anchor>User Agreement</Anchor> and{" "}
                        <Anchor>Privacy Policy</Anchor>.
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
                                    stayP={loginForm.getInputProps("stay")}
                                    passwordP={loginForm.getInputProps("password")}
                                />
                            ) : (
                                <RegisterFields
                                    nameP={regForm.getInputProps("full_name")}
                                    emailP={regForm.getInputProps("email")}
                                    numberP={regForm.getInputProps("phone_number")}
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
