import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ActionIcon, createStyles, HoverCard, Paper, Text, TextInput, useMantineColorScheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        display: "flex",
        gap: theme.spacing.md,
        justifyContent: "space-between",
        padding: `${theme.spacing.xs}px ${theme.spacing.xs * 2}px`,
        borderBottom:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[5]}` : `1px solid ${theme.colors.gray[2]}`
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
        borderRadius: 10,
        marginLeft: 12,
        marginTop: 12
    },
    group: {
        gap: theme.spacing.md,
        display: "flex",
        alignItems: "center"
    }
}));

export const Header: FC = () => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const { property, step, dispatch } = useContext(EditPropertyContext);

    // Input states
    const [label, setLabel] = useState(property!.label);
    const [icon, setIcon] = useState(property!.icon);
    const [labelDebounced] = useDebouncedValue(label, 1000);
    const [iconDebounced] = useDebouncedValue(icon, 1000);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };

    const handleIconSelect = ({ native }: any) => setIcon(native);

    useEffect(() => {
        if (property) {
            if (labelDebounced.length > 0 && labelDebounced != property.label) {
                dispatch({
                    type: "brief",
                    payload: {
                        icon: property.icon,
                        label: labelDebounced
                    }
                });
            } else if (iconDebounced.length > 0 && iconDebounced != property.icon) {
                dispatch({
                    type: "brief",
                    payload: {
                        icon: iconDebounced,
                        label: property.label
                    }
                });
            }
        }
    }, [iconDebounced, labelDebounced]);

    useEffect(() => {
        if (property) {
            if (property.icon != icon) setIcon(property.icon);
            if (property.label != label) setLabel(property.label);
        }
    }, [property]);

    const handleClick = (type: "next" | "previous") => () => dispatch({ type });

    return (
        <div className={classes.wrapper}>
            <div className={classes.group}>
                <HoverCard>
                    <HoverCard.Target>
                        <Paper className={classes.icon}>
                            <Text>{icon}</Text>
                        </Paper>
                    </HoverCard.Target>
                    <HoverCard.Dropdown className={classes.dropdown}>
                        <Picker
                            data={data}
                            emojiSize={20}
                            theme={colorScheme}
                            emojiButtonSize={32}
                            previewPosition={"none"}
                            onEmojiSelect={handleIconSelect}
                        />
                    </HoverCard.Dropdown>
                </HoverCard>
                <TextInput
                    size={"sm"}
                    variant={"filled"}
                    value={label}
                    onChange={handleLabelChange}
                    error={label.length == 0 && "Property Label cannot be empty"}
                />
            </div>
            <div className={classes.group}>
                <ActionIcon
                    size={"lg"}
                    color={"gray"}
                    variant={"filled"}
                    disabled={step < 1}
                    onClick={handleClick("previous")}
                >
                    <TbChevronLeft />
                </ActionIcon>
                <ActionIcon
                    size={"lg"}
                    color={"gray"}
                    variant={"filled"}
                    disabled={step > 2}
                    onClick={handleClick("next")}
                >
                    <TbChevronRight />
                </ActionIcon>
            </div>
        </div>
    );
};
