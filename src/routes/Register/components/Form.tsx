import {
    Box,
    Button,
    createStyles,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Link } from "wouter";

interface RequestData {
    email: string;
    username: string;
    contact: string;
    password: string;
}

const useStyles = createStyles(theme => ({
    container: {
        display: "flex",
        width: "100%",
        maxWidth: "560px",
        flexDirection: "column",
        gap: theme.spacing.xl
    },
    label: {
        fontSize: 28,
        fontWeight: 600
    },
    link: {
        fontWeight: 600,
        textDecoration: "none",
        transition: "all 0.2s ease",
        color: theme.colors.violet[7],

        "&:hover": {
            textDecoration: "underline",
            color: theme.colors.violet[9]
        }
    },
    submit: {
        color: "white",
        transition: "all 0.2s ease",
        backgroundColor: theme.colors.violet[7],
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",

        "&:hover": {
            backgroundColor: theme.colors.violet[9]
        }
    },
    group: {
        width: "100%",
        alignItems: "stretch",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            flexDirection: "column"
        }
    }
}));

export const Form: FC = () => {
    const { classes } = useStyles();
    const [, setCookie] = useCookies(["AccessToken"]);

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            contact: "",
            password: "",
            confirmPassword: ""
        },
        validate: {
            email: value => {
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

                return emailRegex.test(value) ? null : "Invalid email";
            },
            password: value =>
                value.length >= 8
                    ? null
                    : "Password must be at least 8 characters",
            confirmPassword: (value, { password }) =>
                value === password ? null : "Passwords do not match"
        }
    });

    const handleSubmit = form.onSubmit(
        ({ username, email, contact, password }) => {
            let fData: RequestData = {
                username,
                email,
                contact,
                password
            };

            axios
                .post(`${import.meta.env.VITE_ACCOUNT_API}/api/register`, fData)
                .then(({ data }) => {
                    const token = data.token;

                    setCookie("AccessToken", token, {
                        secure: true,
                        sameSite: "strict"
                    });

                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "green"
                    });
                })
                .catch(({ response: { data } }) => {
                    const { type, message, errors } = data;

                    Object.entries(errors).forEach(([key, value]) => {
                        form.setFieldError(key, value as string);
                    });

                    showNotification({
                        title: `🚩 ${type}`,
                        message,
                        color: "red"
                    });
                });
        }
    );

    return (
        <Box className={classes.container}>
            <Stack spacing={12}>
                <Text className={classes.label}>Register</Text>
                <Text fw={500} color={"#777"}>
                    Already have an account?{" "}
                    <Link href={"/login"} className={classes.link}>
                        Login
                    </Link>
                </Text>
            </Stack>
            <form onSubmit={handleSubmit}>
                <Stack spacing={12}>
                    <Group className={classes.group}>
                        <TextInput
                            sx={{ flex: 1, flexGrow: 1 }}
                            size={"md"}
                            label={"Username"}
                            placeholder={"John Doe"}
                            autoComplete={"new-username"}
                            {...form.getInputProps("username")}
                        />
                        <TextInput
                            sx={{ flex: 1, flexGrow: 1 }}
                            size={"md"}
                            autoComplete={"contact"}
                            label={"Contact Information"}
                            placeholder={"+34 9123 8765"}
                            {...form.getInputProps("contact")}
                        />
                    </Group>
                    <TextInput
                        size={"md"}
                        label={"Email"}
                        autoComplete={"new-email"}
                        placeholder={"email@domain.com"}
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        size={"md"}
                        label={"Password"}
                        placeholder={"Your password"}
                        autoComplete={"new-password"}
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        size={"md"}
                        label={"Confirm Password"}
                        autoComplete={"new-password"}
                        placeholder={"Confirm your password"}
                        {...form.getInputProps("confirmPassword")}
                    />
                    <Button
                        mt={"xl"}
                        fullWidth
                        size={"md"}
                        type={"submit"}
                        className={classes.submit}
                    >
                        Register now
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
