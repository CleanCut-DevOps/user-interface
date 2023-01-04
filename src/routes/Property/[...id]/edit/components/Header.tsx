import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    createStyles,
    HoverCard,
    Paper,
    Text,
    TextInput,
    useMantineColorScheme
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        padding: `${theme.spacing.xs}px ${theme.spacing.xs * 2}px`,
        borderBottom:
            theme.colorScheme === "dark"
                ? `1px solid ${theme.colors.dark[5]}`
                : `1px solid ${theme.colors.gray[2]}`
    },
    icon: {
        width: 36,
        height: 36,
        display: "flex",
        cursor: "pointer",
        userSelect: "none",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.sm,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[1]
    },
    dropdown: {
        padding: 0,
        borderRadius: 10,
        marginLeft: 12,
        marginTop: 12
    }
}));

export const Header: FC = () => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const { property, dispatch } = useContext(EditPropertyContext);

    // Input states
    const [label, setLabel] = useState(property!.label);
    const [icon, setIcon] = useState(property!.icon);
    const [labelDebounced] = useDebouncedValue(label, 1000);
    const [iconDebounced] = useDebouncedValue(icon, 1000);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) =>
        setLabel(event.target.value);

    const handleIconSelect = ({ native }: any) => setIcon(native);

    useEffect(() => {
        if (
            labelDebounced != property?.label ||
            iconDebounced != property?.icon
        ) {
            dispatch({
                type: "brief",
                payload: {
                    icon: iconDebounced,
                    label: labelDebounced
                }
            });
        }
    }, [iconDebounced, labelDebounced]);

    useEffect(() => {
        if (property) {
            if (property.icon != icon) setIcon(property.icon);
            if (property.label != label) setLabel(property.label);
        }
    }, [property]);

    return (
        <div className={classes.wrapper}>
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
            />
        </div>
    );
};
