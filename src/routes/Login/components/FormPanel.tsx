import { FC } from "react";
import {
    Box,
    Button,
    Checkbox,
    createStyles,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { Link } from "wouter";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useCookies } from "react-cookie";
import { showNotification } from "@mantine/notifications";

interface RequestData {
    email?: string;
    username?: string;
    password: string;
    stay: boolean;
}

const useStyles = createStyles(() => ({
    panelLabel: {
        fontSize: 28,
        fontWeight: 600
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
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
        "&:hover": {
            backgroundColor: "#2520e3"
        }
    }
}));

export const FormPanel: FC = () => {
    const { classes } = useStyles();
    const [cookies, setCookie] = useCookies(["AccessToken"]);

    const form = useForm({
        initialValues: {
            accessName: "",
            password: "",
            stay: false
        },
        validate: {
            password: value =>
                value.length >= 8
                    ? null
                    : "Password must be at least 8 characters"
        }
    });

    const handleSubmit = form.onSubmit(({ accessName, password, stay }) => {
        let fData: RequestData = {
            password,
            stay
        };

        if (
            RegExp(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
            ).test(accessName)
        ) {
            fData.email = accessName;
        } else {
            fData.username = accessName;
        }

        axios
            .post("http://localhost:8001/api/login", fData)
            .then(({ data }) => {
                const token = data.token;

                setCookie("AccessToken", token, {
                    sameSite: "strict"
                });

                showNotification({
                    title: data.type,
                    message: data.message,
                    color: "green"
                });
            })
            .catch(({ response }) => {
                console.log(response);
            });
    });

    return (
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
                <form onSubmit={handleSubmit}>
                    <Stack spacing={24}>
                        <TextInput
                            size={"md"}
                            label="Email / username"
                            placeholder="hello@domain.com / John Doe"
                            {...form.getInputProps("accessName")}
                        />
                        <PasswordInput
                            size={"md"}
                            label="Password"
                            placeholder="Your password"
                            {...form.getInputProps("password")}
                        />
                        <Group position="apart">
                            <Checkbox
                                size="md"
                                label="Remember me"
                                color="dark"
                                {...form.getInputProps("stay")}
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
                            type={"submit"}
                            color={"indigo"}
                            className={classes.submit}>
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};
