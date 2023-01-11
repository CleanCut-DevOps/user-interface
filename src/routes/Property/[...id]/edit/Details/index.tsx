import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    createStyles,
    Grid,
    HoverCard,
    Paper,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
    useMantineColorScheme
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { ChangeEvent, FC, ReactNode, useContext } from "react";
import { EditPropertyContext } from "../components";
import { ImagesPreview } from "./ImagesPreview";

const useStyles = createStyles(theme => ({
    wrapper: {
        flex: 1,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        flexDirection: "column",
        padding: theme.spacing.lg,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: 4 }
    },
    labels: {
        gap: 4,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",

        [`@media (max-width: 815px)`]: {
            width: "100%",
            alignItems: "flex-start"
        }
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
    const { width } = useViewportSize();
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
            <div className={classes.labels}>
                <Title order={width > 815 ? 1 : 3}>Your property details</Title>
                <Text size={width > 815 ? "md" : "sm"} color={"dimmed"}>
                    This information will be used for our cleaners and yourself.
                </Text>
            </div>
            <Grid mt={"md"} maw={768} columns={11}>
                <Row w={width} req label={"Identifier"}>
                    <Stack spacing={4}>
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
                    </Stack>
                </Row>
                <Row w={width} req label={"Label"}>
                    <Stack spacing={4}>
                        <TextInput
                            size={"sm"}
                            variant={"default"}
                            value={property?.label}
                            onChange={handleLabelChange}
                            error={property?.label.length == 0 && "Property Label cannot be empty"}
                        />
                    </Stack>
                </Row>
                <Row w={width} label={"Description"}>
                    <Stack spacing={4}>
                        <Textarea
                            autosize
                            minRows={2}
                            maxRows={4}
                            variant={"default"}
                            onChange={handleDescriptionChange}
                            value={property?.description ?? ""}
                        />
                    </Stack>
                </Row>
                <Row w={width} label={"Images"}>
                    <Stack spacing={4}>
                        <ImagesPreview />
                        <Text size={"sm"} color={"dimmed"}>
                            This will help our cleaners easily identify your property.
                        </Text>
                    </Stack>
                </Row>
            </Grid>
        </div>
    );
};

type RowProps = {
    w: number;
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ w, label, req, children }) => {
    return (
        <>
            <Grid.Col span={3} style={{ display: w > 815 ? "block" : "none" }}>
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={w > 815 ? 8 : 11}>
                <Stack spacing={4}>
                    <Title order={6} style={{ display: w > 815 ? "none" : "block" }}>
                        {label} {req && <span style={{ color: "red" }}>*</span>}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
