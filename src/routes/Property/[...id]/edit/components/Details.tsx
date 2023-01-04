import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    Center,
    createStyles,
    Grid,
    HoverCard,
    Input,
    Paper,
    Text,
    Textarea,
    Title,
    useMantineColorScheme
} from "@mantine/core";
import { useDebouncedState, useDebouncedValue } from "@mantine/hooks";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { EditPropertyContext } from "./Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        marginTop: theme.spacing.lg,
        flexDirection: "column",
        gap: theme.spacing.lg
    },
    container: {
        width: "100%",
        padding: theme.spacing.sm,
        maxWidth: theme.breakpoints.sm,
        borderRadius: theme.radius.md,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        boxShadow: theme.shadows.xl
    },
    centerVertical: {
        display: "flex",
        alignItems: "center"
    },
    req: {
        color: theme.colors.red[5]
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

export const Details: FC = () => {
    const { colorScheme } = useMantineColorScheme();
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    // Input states
    const [icon, setIcon] = useState(property!.icon);
    const [label, setLabel] = useState(property!.label);
    const [description, setDescription] = useState(property!.description);
    const [iconDebounced] = useDebouncedState(icon, 500);
    const [labelDebounced] = useDebouncedValue(label, 500);
    const [descriptionDebounced] = useDebouncedValue(description, 500);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) =>
        setLabel(event.target.value);

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
        setDescription(event.target.value);

    const handleIconChange = ({ native }: any) => setIcon(native);

    useEffect(() => {
        if (
            labelDebounced != property?.label ||
            iconDebounced != property?.icon ||
            descriptionDebounced != property?.description
        ) {
            dispatch({
                type: "details",
                payload: {
                    label: labelDebounced,
                    icon: iconDebounced,
                    description: descriptionDebounced,
                    images: []
                }
            });
        }
    }, [iconDebounced, labelDebounced, descriptionDebounced]);

    useEffect(() => {
        if (property) {
            if (property.icon != icon) setIcon(property.icon);
            if (property.label != label) setLabel(property.label);
            if (property.description != description)
                setDescription(property.description ?? "");
        }
    }, [property]);

    return (
        <Center className={classes.wrapper}>
            <Title>Your property details</Title>
            <Text color={"dimmed"}>
                This information will be used for our cleaners and yourself.
            </Text>
            <Paper className={classes.container}>
                <Grid columns={24}>
                    <Grid.Col span={6} className={classes.centerVertical}>
                        <Text>
                            Identifier <span className={classes.req}>*</span>
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={18}>
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
                    </Grid.Col>
                    <Grid.Col span={6} className={classes.centerVertical}>
                        <Text>
                            Label <span className={classes.req}>*</span>
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={18}>
                        <Input
                            value={label}
                            variant={"filled"}
                            onChange={handleLabelChange}
                        />
                    </Grid.Col>
                    <Grid.Col span={6} className={classes.centerVertical}>
                        <Text>Description</Text>
                    </Grid.Col>
                    <Grid.Col span={18}>
                        <Textarea
                            value={description ?? ""}
                            variant={"filled"}
                            onChange={handleDescriptionChange}
                            autosize
                            minRows={2}
                            maxRows={4}
                        />
                    </Grid.Col>
                    <Grid.Col span={6} className={classes.centerVertical}>
                        <Text>Images</Text>
                    </Grid.Col>
                    <Grid.Col span={18}>
                        <Input variant={"filled"} />
                    </Grid.Col>
                </Grid>
            </Paper>
        </Center>
    );
};
