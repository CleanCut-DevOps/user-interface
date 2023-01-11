import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    createStyles,
    Grid,
    HoverCard,
    Paper,
    ScrollArea,
    Text,
    Textarea,
    TextInput,
    Title,
    useMantineColorScheme
} from "@mantine/core";
import { ChangeEvent, FC, ReactNode, useContext } from "react";
import { EditPropertyContext } from "../components";
import { ImagesPreview } from "./ImagesPreview";

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column"
    },
    container: {
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        maxWidth: theme.breakpoints.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
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
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        border: theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`
    },
    dropdown: {
        padding: 0,
        marginTop: 12,
        marginLeft: 12,
        borderRadius: 10
    }
}));

export const Details: FC = () => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const { property, dispatch } = useContext(EditPropertyContext);

    const handleIconChange = ({ native }: { native: string }) => {
        dispatch({ type: "details", payload: { icon: native } });
    };

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "details", payload: { label: event.target.value } });
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: "details", payload: { description: event.target.value } });
    };

    return (
        <div className={classes.wrapper}>
            <Title>Your property details</Title>
            <Text color={"dimmed"}>This information will be used for our cleaners and yourself.</Text>
            <div className={classes.container}>
                <Grid w={"100%"} columns={11}>
                    <Row req label={"Identifier"}>
                        <HoverCard>
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
                    </Row>
                    <Row req label={"Label"}>
                        <TextInput
                            size={"sm"}
                            variant={"default"}
                            value={property?.label}
                            onChange={handleLabelChange}
                            error={property?.label.length == 0 && "Property Label cannot be empty"}
                        />
                    </Row>
                    <Row label={"Description"}>
                        <Textarea
                            autosize
                            minRows={2}
                            maxRows={4}
                            variant={"default"}
                            onChange={handleDescriptionChange}
                            value={property?.description ?? ""}
                        />
                    </Row>
                    <Row label={"Images"}>
                        <ImagesPreview />
                    </Row>
                </Grid>
            </div>
        </div>
    );
};

type RowProps = {
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ label, req, children }) => {
    return (
        <>
            <Grid.Col span={3}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>{children}</Grid.Col>
        </>
    );
};
