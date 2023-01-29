import {
    ActionIcon,
    AppShell,
    Burger,
    Container,
    createStyles,
    Flex,
    Group,
    Header,
    MediaQuery,
    ScrollArea,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineColorScheme
} from "@mantine/core";

import { FC, PropsWithChildren, useState } from "react";
import { MdOutlineCleaningServices } from "react-icons/md";
import { TbMoonStars, TbSun } from "react-icons/tb";
import { useLocation } from "wouter";

import { DashboardNavbar } from "./Navbar";

const useStyles = createStyles(theme => ({
    main: {
        height: "100vh",
        overflow: "hidden"
    },
    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.indigo[4] : theme.colors.indigo[9]
    },
    header: {
        display: "block",

        [`@media (min-width: ${theme.breakpoints.sm - 1}px)`]: {
            display: "none"
        }
    }
}));

export const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [opened, setOpened] = useState(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <AppShell
            padding={0}
            classNames={classes}
            navbarOffsetBreakpoint="sm"
            header={
                <Header height={{ base: 50, sm: 0 }} p="8px" className={classes.header}>
                    <Flex align="center" justify="space-between">
                        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                            <Burger opened={opened} onClick={() => setOpened(o => !o)} size="sm" />
                        </MediaQuery>

                        <UnstyledButton onClick={() => setLocation("/")}>
                            <Group spacing="xs">
                                <ThemeIcon size="md" radius="md" variant="light" color="gray">
                                    <MdOutlineCleaningServices size={12} className={classes.icon} />
                                </ThemeIcon>
                                <Text size={18} weight={600} lineClamp={1}>
                                    CleanCut
                                </Text>
                            </Group>
                        </UnstyledButton>

                        <ActionIcon
                            onClick={() => toggleColorScheme()}
                            size="lg"
                            radius="md"
                            sx={theme => ({
                                backgroundColor:
                                    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                                color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6]
                            })}
                        >
                            {colorScheme === "dark" ? <TbSun /> : <TbMoonStars />}
                        </ActionIcon>
                    </Flex>
                </Header>
            }
            navbar={<DashboardNavbar opened={opened} />}
        >
            <Container px={0} h="100%" size="xl">
                <ScrollArea h="100%" scrollbarSize={6}>
                    {children}
                </ScrollArea>
            </Container>
        </AppShell>
    );
};
