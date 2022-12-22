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
            email: "",
            contact: "",
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

    const handleSubmit = form.onSubmit(({ accessName, email, contact, password, stay }) => {
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
            .post("http://localhost:8001/api/register", fData)
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
                    <Text className={classes.panelLabel}>Register</Text>
                    <Text fw={500} color={"#777"}>
                        Already have an account?{" "} 
                        <Link href={"/login"} className={classes.link}>
                            Login
                        </Link>
                    </Text>
                </Stack>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={24}>
                    <TextInput
                            size={"md"}
                            label="Username"
                            placeholder="John Doe "
                            {...form.getInputProps("accessName")}
                        />
                        <TextInput
                            size={"md"}
                            label="Email"
                            placeholder="hello@domain.com "
                            {...form.getInputProps("email")}
                        />
                        <TextInput
                            size={"md"}
                            label="Contact"
                            placeholder="9999 9999 "
                            {...form.getInputProps("contact")}
                        />
                        <PasswordInput
                            size={"md"}
                            label="Password"
                            placeholder="Your password"
                            {...form.getInputProps("password")}
                        />
                       
                        <Button
                            fullWidth
                            size={"md"}
                            type={"submit"}
                            color={"indigo"}
                            className={classes.submit}>
                            Register
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};