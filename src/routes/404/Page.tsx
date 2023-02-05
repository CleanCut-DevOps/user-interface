import { Button, Center, Container, createStyles, Image, SimpleGrid, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useLocation } from "wouter";
import image from "./components/image.svg";

const useStyles = createStyles(theme => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80
    },

    title: {
        fontWeight: 900,
        fontSize: 34,
        marginBottom: theme.spacing.md,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

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

export const NotFound: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();

    return (
        <Center sx={{ flex: 1 }}>
            <Container className={classes.root}>
                <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}>
                    <Image src={image} className={classes.mobileImage} />
                    <div>
                        <Title className={classes.title}>Something is not right...</Title>
                        <Text size="lg">The page you are trying to open does not exist.</Text>
                        <Text mt={4} color="dimmed" size="sm">
                            You may have mistyped the address, or the page has been moved to another URL. If you think
                            this is an error contact support.
                        </Text>
                        <Button
                            variant="outline"
                            size="md"
                            mt="xl"
                            className={classes.control}
                            onClick={() => setLocation("/")}
                        >
                            Get back to home page
                        </Button>
                    </div>
                    <Image src={image} className={classes.desktopImage} />
                </SimpleGrid>
            </Container>
        </Center>
    );
};
