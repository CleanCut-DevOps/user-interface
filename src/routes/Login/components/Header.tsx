import { ActionIcon, createStyles, Group, ThemeIcon, Title, useMantineColorScheme } from "@mantine/core";
import { FC } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { TbMoonStars, TbSun } from "react-icons/tb";

const useStyles = createStyles(theme => ({
    header: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing.md,
        justifyContent: "space-between",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "white"
    },
    logo: {
        display: "flex",
        cursor: "pointer",
        userSelect: "none",
        alignItems: "center",
        gap: theme.spacing.md
    },
    link: {
        color: "inherit",
        textDecoration: "none"
    },
    icon: {
        transition: "0.2s ease",
        color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.indigo[8],
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]
    }
}));

export const Header: FC = () => {
    const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Group className={classes.header}>
            <a href={import.meta.env.VITE_LANDING_SITE} className={classes.link}>
                <Group className={classes.logo}>
                    <ThemeIcon size={"lg"} color={"gray"} variant={"light"}>
                        <MdOutlineCleaningServices />
                    </ThemeIcon>
                    <Title order={4}>CleanCut</Title>
                </Group>
            </a>
            <ActionIcon size="lg" className={classes.icon} onClick={() => toggleColorScheme()}>
                {colorScheme === "dark" ? <TbSun size={18} /> : <TbMoonStars size={18} />}
            </ActionIcon>
        </Group>
    );
};
