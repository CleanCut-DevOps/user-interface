import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button, createStyles, Header, HoverCard, Paper, Text, TextInput, useMantineColorScheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

import axios from "axios";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useLocation } from "wouter";

import { EditPropertyContext } from "../../components/PropertyProvider";

const useStyles = createStyles(theme => ({
    wrapper: {
        display: "flex",
        gap: theme.spacing.md,
        justifyContent: "space-between",
        padding: `${theme.spacing.xs}px ${theme.spacing.xs * 2}px`
    },
    section: {
        maxHeight: 64,
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingInline: theme.spacing.md,
        borderBottom:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[5]}` : `1px solid ${theme.colors.gray[2]}`,

        [`@media (width >= ${theme.breakpoints.sm - 1}px)`]: { ":last-of-type": { display: "none" } }
    },
    icon: {
        minWidth: 36,
        minHeight: 36,
        display: "flex",
        cursor: "pointer",
        userSelect: "none",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    },
    dropdown: {
        padding: 0,
        marginTop: 12,
        borderRadius: 4
    },
    group: {
        gap: theme.spacing.md,
        display: "flex",
        alignItems: "center"
    },
    actions: {
        display: "flex",

        [`@media (width <= ${theme.breakpoints.sm - 1}px)`]: {
            display: "none"
        }
    }
}));

export const EditHeader: FC = () => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [loaded, setLoaded] = useState(false);
    const [cookies] = useCookies(["AccessToken"]);
    const { colorScheme } = useMantineColorScheme();
    const { property, step, dispatch } = useContext(EditPropertyContext);

    // input values
    const [label, setLabel] = useState(property?.label ?? "");
    const [icon, setIcon] = useState(property?.icon ?? "");

    // debounced values
    const [debouncedLabel, setDebouncedLabel] = useDebouncedValue(label, 500);
    const [debouncedIcon, setDebouncedIcon] = useDebouncedValue(icon, 500);

    useEffect(() => {
        if (!loaded) setLoaded(true);
    }, [loaded]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}`,
                { icon: debouncedIcon },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedIcon]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/property/${property?.id}`,
                { label: debouncedLabel },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedLabel]);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);

        dispatch({ type: "details", payload: { label: event.target.value } });
    };

    const handleIconChange = ({ native }: any) => {
        setIcon(native);

        dispatch({ type: "details", payload: { icon: native } });
    };

    const handleClick = (type: "next" | "previous") => () => {
        if (type == "next" && step > 1) {
            setLocation(`/property/${property?.id}`);
        } else dispatch({ type });
    };

    return (
        <Header height={{ base: 128, sm: 64 }} withBorder={false}>
            <div className={classes.section}>
                <HoverCard position="bottom-start">
                    <HoverCard.Target>
                        <Paper className={classes.icon}>
                            <Text>{property?.icon}</Text>
                        </Paper>
                    </HoverCard.Target>
                    <HoverCard.Dropdown className={classes.dropdown}>
                        <Picker
                            data={data}
                            emojiSize={20}
                            theme={colorScheme}
                            emojiButtonSize={32}
                            previewPosition={"none"}
                            onEmojiSelect={handleIconChange}
                        />
                    </HoverCard.Dropdown>
                </HoverCard>
                <TextInput
                    size={"sm"}
                    variant={"filled"}
                    onChange={handleLabelChange}
                    value={property?.label ?? ""}
                    error={property?.label.length == 0 && "Property Label cannot be empty"}
                />
                <div style={{ flex: 1 }} />
                <Button
                    color="dark"
                    variant="filled"
                    disabled={step < 1}
                    className={classes.actions}
                    leftIcon={<TbChevronLeft />}
                    onClick={handleClick("previous")}
                >
                    Previous
                </Button>
                <Button
                    color="dark"
                    variant="filled"
                    className={classes.actions}
                    onClick={handleClick("next")}
                    rightIcon={<TbChevronRight />}
                >
                    {step > 1 ? "Done" : "Next"}
                </Button>
            </div>
            <div className={classes.section}>
                <Button
                    color="dark"
                    variant="filled"
                    disabled={step < 1}
                    leftIcon={<TbChevronLeft />}
                    onClick={handleClick("previous")}
                >
                    Previous
                </Button>
                <div style={{ flex: 1 }} />
                <Button color="dark" variant="filled" onClick={handleClick("next")} rightIcon={<TbChevronRight />}>
                    {step > 1 ? "Finish" : "Next"}
                </Button>
            </div>
        </Header>
    );
};
