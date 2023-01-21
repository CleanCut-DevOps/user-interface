import {
    ActionIcon,
    createStyles,
    Divider,
    Group,
    Menu,
    ScrollArea,
    SegmentedControl,
    Stack,
    Title
} from "@mantine/core";
import { FC, useContext } from "react";
import { TbCheck, TbFilter } from "react-icons/tb";
import { AuthWrapper, DefaultLayout } from "../../components";
import { GridProperties } from "./components/grid";
import { ListProperties } from "./components/list";
import { PropertyCollectionContext, PropertyCollectionProvider } from "./components/Provider";

type Control = { label: string; value: "grid" | "list" };

const useStyles = createStyles(theme => ({
    controlRoot: {
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2]
    },
    controlControls: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
    },
    filterIcon: {
        transition: "0.2s ease",
        color: theme.colorScheme === "dark" ? "white" : "black",
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        boxShadow: theme.shadows.xs,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
        },

        "&:active": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[3]
        }
    }
}));

const controls: Control[] = [
    { label: "Grid", value: "grid" },
    { label: "List", value: "list" }
];

const sortOptions = [
    { label: "Alphabetical", value: "alphabetical" },
    { label: "Date Created", value: "created" },
    { label: "Date Updated", value: "updated" }
];

const directionOptions = [
    { label: "Ascending", value: true },
    { label: "Descending", value: false }
];

export const PropertyListing: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <PropertyCollectionProvider>
                <DefaultLayout>
                    <Stack h={"100%"} spacing={"md"}>
                        <Group position={"apart"}>
                            <Title order={2}>Your properties</Title>
                            <CollectionFilter />
                        </Group>
                        <Divider />
                        <CollectionViewport />
                    </Stack>
                </DefaultLayout>
            </PropertyCollectionProvider>
        </AuthWrapper>
    );
};

const CollectionViewport: FC = () => {
    const { view } = useContext(PropertyCollectionContext);

    return (
        <ScrollArea style={{ flex: 1 }} scrollbarSize={6}>
            {view == "list" && <ListProperties />}
            {view == "grid" && <GridProperties />}
        </ScrollArea>
    );
};

const CollectionFilter: FC = () => {
    const { classes } = useStyles();
    const { sort, view, direction, dispatch } = useContext(PropertyCollectionContext);

    const handleSortChange = (value: string) => () => dispatch({ type: "sort", payload: value });
    const handleDirectionChange = (value: boolean) => () => dispatch({ type: "direction", payload: value });

    return (
        <Group>
            <Menu offset={8} position={"bottom-end"} closeOnItemClick={false}>
                <Menu.Target>
                    <ActionIcon className={classes.filterIcon} size={"lg"}>
                        <TbFilter />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Sort by</Menu.Label>
                    {sortOptions.map(({ label, value }, i) => (
                        <Menu.Item
                            key={i}
                            onClick={handleSortChange(value)}
                            icon={sort == value ? <TbCheck /> : <div style={{ width: 14 }} />}
                        >
                            {label}
                        </Menu.Item>
                    ))}

                    <Menu.Divider />

                    <Menu.Label>Sort direction</Menu.Label>
                    {directionOptions.map(({ label, value }, i) => (
                        <Menu.Item
                            key={i}
                            onClick={handleDirectionChange(value)}
                            icon={direction == value ? <TbCheck /> : <div style={{ width: 14 }} />}
                        >
                            {label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
            <SegmentedControl
                size={"sm"}
                data={controls}
                value={view}
                onChange={value => dispatch({ type: "view", payload: value })}
                classNames={{ root: classes.controlRoot, active: classes.controlControls }}
            />
        </Group>
    );
};
