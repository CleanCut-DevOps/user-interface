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
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { Link } from "wouter";

interface RequestData {
    username?: string;
    email?: string;
    contact?: string;
    password: string;
    stay: boolean;
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
    }
}));

export const Form: FC = () => {
    const { classes } = useStyles();
    const [loading, toggleLoading] = useToggle();
    const [, setCookie] = useCookies(["AccessToken"]);

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
        toggleLoading();
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
            .post(`${import.meta.env.VITE_ACCOUNT_API}/api/login`, fData)
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
                const { type, message } = data;

                form.setErrors({
                    accessName: "Your access name or password is incorrect"
                });

                showNotification({
                    title: `🚩 ${type}`,
                    message,
                    color: "red"
                });
                toggleLoading();
            });
    });

    return (
        <Box className={classes.container}>
            <Stack spacing={12} w={"100%"}>
                <Text className={classes.label}>Login</Text>
                <Text fw={500} color={"#777"}>
                    Don't have an account?{" "}
                    <Link href={"/register"} className={classes.link}>
                        Register
                    </Link>
                </Text>
            </Stack>
            <form onSubmit={handleSubmit}>
                <Stack spacing={12}>
                    <TextInput
                        size={"md"}
                        autoComplete={"username"}
                        label={"Email / username"}
                        placeholder={"email@domain.com / John Doe"}
                        {...form.getInputProps("accessName")}
                    />
                    <PasswordInput
                        size={"md"}
                        label={"Password"}
                        placeholder={"Your password"}
                        autoComplete={"current-password"}
                        {...form.getInputProps("password")}
                    />
                    <Group
                        mt={"sm"}
                        sx={{
                            gap: 8,
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                        }}
                    >
                        <Checkbox
                            size={"md"}
                            color={"dark"}
                            label={"Remember me"}
                            {...form.getInputProps("stay")}
                        />
                        <Link href={"/resetPassword"} className={classes.link}>
                            Forgot password?
                        </Link>
                    </Group>
                    <Button
                        mt={"xs"}
                        fullWidth
                        size={"md"}
                        type={"submit"}
                        loading={loading}
                        className={classes.submit}
                    >
                        Sign in
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};
