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
import { useDebouncedState } from "@mantine/hooks";
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
    const [label, setLabel] = useDebouncedState(property?.label ?? "", 300);
    const [icon, setIcon] = useState<string>(property?.icon ?? "🏡");

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) =>
        setLabel(event.target.value);

    const handleIconSelect = ({ native }: any) => setIcon(native);

    useEffect(() => {
        if (label != property?.label || icon != property?.icon) {
            dispatch({
                type: "brief",
                payload: {
                    icon: icon,
                    label: label
                }
            });
        }
    }, [icon, label]);

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
                defaultValue={label}
                onChange={handleLabelChange}
            />
        </div>
    );
};
