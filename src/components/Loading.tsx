import { Box, Center, createStyles, Loader, Text } from "@mantine/core";
import { FC } from "react";

const useStyles = createStyles(theme => ({
    wrapper: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    },
    centered: {
        width: "100%",
        height: "100%",
        minWidth: "100vw",
        minHeight: "100vh",
        gap: theme.spacing.md,

        [`@media (max-width: ${theme.breakpoints.xs})`]: { paddingLeft: theme.spacing.xl }
    }
}));

export const Loading: FC = () => {
    const { classes } = useStyles();

    return (
        <Box className={classes.wrapper}>
            <Center className={classes.centered}>
                <Loader color={"indigo"} variant={"bars"} />
                <Text inline fw={400} size={"sm"} color={"dimmed"}>
                    Hold on — getting this page ready for you
                </Text>
            </Center>
        </Box>
    );
};
