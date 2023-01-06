import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    createStyles,
    HoverCard,
    Paper,
    Text,
    useMantineColorScheme
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useContext, useEffect, useState } from "react";
import { EditPropertyContext } from "../components/Provider";

const useStyles = createStyles(theme => ({
    icon: {
        width: 36,
        height: 36,
        display: "flex",
        cursor: "pointer",
        userSelect: "none",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.sm,
        border:
            theme.colorScheme === "dark"
                ? `1px solid ${theme.colors.dark[4]}`
                : `1px solid ${theme.colors.gray[4]}`,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
    },
    dropdown: {
        padding: 0,
        borderRadius: 10,
        marginLeft: 12,
        marginTop: 12
    }
}));

export const Identifier: FC = () => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const { property, dispatch } = useContext(EditPropertyContext);

    // Form states
    const [icon, setIcon] = useState(property!.icon);
    const [iconDebounced] = useDebouncedValue(icon, 1000);

    useEffect(() => {
        if (property) {
            if (iconDebounced.length > 0 && iconDebounced != property.icon) {
                dispatch({
                    type: "details",
                    payload: {
                        icon: iconDebounced,
                        label: property.label,
                        description: property.description,
                        images: property.images
                    }
                });
            }
        }
    }, [iconDebounced]);

    useEffect(() => {
        if (property && iconDebounced != property.icon) {
            setIcon(property.icon);
        }
    }, [property]);

    const handleIconChange = ({ native }: { native: string }) =>
        setIcon(native);

    return (
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
                    onEmojiSelect={handleIconChange}
                />
            </HoverCard.Dropdown>
        </HoverCard>
    );
};
