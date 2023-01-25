import { Center, createStyles, Loader, Stack, Text } from "@mantine/core";
import { FC } from "react";

const useStyles = createStyles(theme => ({
    wrapper: {
        width: "100vw",
        height: "100vh"
    },
    header: {
        padding: theme.spacing.sm,
        border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]}`
    },
    content: {
        flex: 1,
        height: "100%",
        gap: theme.spacing.md
    }
}));

export const Loading: FC = () => {
    const { classes } = useStyles();
    return (
        <Stack className={classes.wrapper}>
            <div className={classes.header}>
                <Text size="lg" weight={600}>
                    CleanCut
                </Text>
            </div>
            <Center className={classes.content}>
                <Loader variant="bars" color="indigo" size={32} />
                <Text>Getting things ready for you</Text>
            </Center>
        </Stack>
    );
};
