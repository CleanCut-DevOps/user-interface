import { createStyles, Text, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect } from "react";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        gap: theme.spacing.xs,
        display: "flex",
        alignItems: "center",
        padding: `${theme.spacing.xs}px ${theme.spacing.xl}px`,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0]
    }
}));

export const Header: FC = () => {
    const { classes } = useStyles();
    const { property } = useContext(EditPropertyContext);
    const [value, setValue] = useDebouncedState(property?.label ?? "", 300);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setValue(event.target.value);

    useEffect(() => {
        if (value != property?.label) {
            console.log(`Setting the label of the property to: ${value}`);
        }
    }, [value]);

    return (
        <div className={classes.wrapper}>
            <Text size={"sm"} color={"dimmed"}>
                Properties
            </Text>
            <Text>/</Text>
            <TextInput
                size={"sm"}
                variant={"filled"}
                defaultValue={value}
                onChange={handleChange}
            />
        </div>
    );
};
