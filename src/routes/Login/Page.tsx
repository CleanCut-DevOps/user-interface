import {
    ActionIcon,
    Box,
    createStyles,
    Group,
    Header,
    Stack,
    ThemeIcon,
    Title,
    useMantineColorScheme
} from "@mantine/core";
import { FC } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { TbMoonStars, TbSun } from "react-icons/tb";
import { Form } from "./components/Form";

const useStyles = createStyles(theme => ({
    header: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing.md,
        justifyContent: "space-between"
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md
    },
    wrapper: {
        padding: theme.spacing.md,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}));

export const Login: FC = () => {
    const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Stack>
            <Header height={""} className={classes.header}>
                <Group className={classes.logo}>
                    <ThemeIcon size={"lg"} color={"gray"} variant={"light"}>
                        <MdOutlineCleaningServices />
                    </ThemeIcon>
                    <Title order={4}>CleanCut</Title>
                </Group>
                <ActionIcon
                    onClick={() => toggleColorScheme()}
                    size="lg"
                    sx={theme => ({
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                        color:
                            theme.colorScheme === "dark"
                                ? theme.colors.yellow[4]
                                : theme.colors.blue[6]
                    })}
                >
                    {colorScheme === "dark" ? (
                        <TbSun size={18} />
                    ) : (
                        <TbMoonStars size={18} />
                    )}
                </ActionIcon>
            </Header>
            <Box className={classes.wrapper}>
                <Form />
            </Box>
        </Stack>
    );
};
