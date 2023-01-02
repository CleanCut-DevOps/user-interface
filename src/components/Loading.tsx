import { Box, Center, createStyles, Loader, Text } from "@mantine/core";
import { FC } from "react";

const useStyles = createStyles(theme => ({
    wrapper: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0]
    },
    centered: {
        width: "100%",
        height: "100%",
        minWidth: "100vw",
        minHeight: "100vh",
        gap: theme.spacing.md
    }
}));

export const Loading: FC = () => {
    const { classes } = useStyles();

    return (
        <Box className={classes.wrapper}>
            <Center className={classes.centered}>
                <Loader color={"indigo"} variant={"bars"} />
                <Text fw={200}>Hold on — getting this page ready for you</Text>
            </Center>
        </Box>
    );
};
