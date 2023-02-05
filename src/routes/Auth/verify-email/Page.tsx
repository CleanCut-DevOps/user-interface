import { Button, Center, Container, createStyles, Image, SimpleGrid, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";

import { useUserData } from "~/hooks";

import image from "./components/image.svg";

const useStyles = createStyles(theme => ({
    root: { padding: theme.spacing.md },

    title: {
        fontSize: 34,
        fontWeight: 900,
        lineHeight: 1.25,

        [theme.fn.smallerThan("sm")]: {
            fontSize: 32
        }
    },

    control: {
        [theme.fn.smallerThan("sm")]: {
            width: "100%"
        }
    },

    mobileImage: {
        [theme.fn.largerThan("sm")]: {
            display: "none"
        }
    },

    desktopImage: {
        [theme.fn.smallerThan("sm")]: {
            display: "none"
        }
    }
}));

export const VerifyEmail: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [cookies] = useCookies(["AccessToken"]);
    const [loading, setLoading] = useState(false);
    const { isError } = useUserData(cookies.AccessToken);

    useEffect(() => {
        if (!isError || isError.response.status != 422) setLocation("/");
    }, [isError]);

    const handleClick = async () => {
        setLoading(true);

        await axios
            .post(
                `${import.meta.env.VITE_ACCOUNT_API}/email/re-verify`,
                {},
                { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
            )
            .then(({ data }) => {
                showNotification({
                    title: data.type,
                    message: data.message,
                    color: "green"
                });
            })
            .catch(({ response: { status, data } }) => {
                if (status == 429) {
                    showNotification({
                        title: `🚩 Too many requests`,
                        message: "You have reached the maximum number of requests. Please try again later.",
                        color: "red"
                    });
                } else {
                    showNotification({
                        title: `🚩 ${data.type}`,
                        message: data.message,
                        color: "red"
                    });
                }
            });

        setLoading(false);
    };

    return (
        <Center sx={{ flex: 1 }}>
            <Container className={classes.root}>
                <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}>
                    <Image src={image} className={classes.mobileImage} />
                    <div>
                        <Text className={classes.title}>Thank you for choosing CleanCut.</Text>
                        <Text mt={4} mb="xl" color="dimmed" size="lg">
                            A verification email has been sent to your email account. Please check your inbox to verify.
                        </Text>
                        <Button
                            size="md"
                            variant="outline"
                            loading={loading}
                            onClick={handleClick}
                            className={classes.control}
                        >
                            Resend verification email
                        </Button>
                        <Text color="dimmed" size="xs" mt="xl">
                            Tip: If you don't see the email in your inbox, please check your spam or trash folder.
                        </Text>
                    </div>
                    <Image src={image} className={classes.desktopImage} />
                </SimpleGrid>
            </Container>
        </Center>
    );
};
