import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    Center,
    createStyles,
    FileButton,
    Grid,
    Image,
    HoverCard,
    Paper,
    ScrollArea,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
    useMantineColorScheme,
    Overlay,
    Button,
    Group,
    Transition
} from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDebouncedValue, useHover } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { TbPhoto, TbUpload, TbX } from "react-icons/tb";
import { EditPropertyContext } from "./Provider";

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
        flex: 1,
        width: "100%",
        height: "min-content",
        maxWidth: theme.breakpoints.sm,
        maxHeight: "100%",
        overflow: "hidden",
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[1]
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
    },
    dropzone: {
        height: "100%",
        width: "100%"
    },
    dropzoneHolder: {
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: theme.radius.sm,
        transition: "0.2s ease",
        border:
            theme.colorScheme === "dark"
                ? `2px dashed ${theme.colors.dark[3]}`
                : "none",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
        },

        "&:active": {
            transform: "translateY(4px)"
        }
    },
    dropIcon: {
        color: theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
        ]
    },
    dropRejectIcon: {
        color: theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    },
    imageWrapper: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
        objectFit: "contain",
        aspectRatio: "16 / 9",
        borderRadius: theme.radius.sm
    },
    imageOverlay: {
        inset: 0,
        zIndex: 9999,
        position: "absolute",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.xl
    }
}));

enum ErrorCode {
    FileInvalidType = "file-invalid-type",
    FileTooLarge = "file-too-large",
    FileTooSmall = "file-too-small",
    TooManyFiles = "too-many-files"
}

type FileError = {
    message: string;
    code: ErrorCode | string;
};

type FileRejection = {
    file: File;
    errors: FileError[];
};

export const Details: FC = () => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const { hovered, ref } = useHover<HTMLDivElement>();
    const { property, dispatch } = useContext(EditPropertyContext);

    // Form states
    const [icon, setIcon] = useState(property!.icon);
    const [label, setLabel] = useState(property!.label);
    const [description, setDescription] = useState(property!.description);
    const [image, setImage] = useState<FileWithPath | null>(null);
    const [images, setImages] = useState<string[]>(property!.images);

    // Debounced states
    const [iconDebounced] = useDebouncedValue(icon, 1000);
    const [labelDebounced] = useDebouncedValue(label, 1000);
    const [descriptionDebounced] = useDebouncedValue(description, 1000);

    useEffect(() => {
        if (property) {
            if (labelDebounced.length > 0 && labelDebounced != property.label) {
                dispatch({
                    type: "details",
                    payload: {
                        icon: property.icon,
                        label: labelDebounced,
                        description: property.description,
                        images: property.images
                    }
                });
            }

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

            if (descriptionDebounced != property.description) {
                dispatch({
                    type: "details",
                    payload: {
                        icon: property.icon,
                        label: property.label,
                        description: descriptionDebounced,
                        images: property.images
                    }
                });
            }
        }
    }, [iconDebounced, labelDebounced, descriptionDebounced]);

    useEffect(() => {
        if (property) {
            if (icon != property.icon) setIcon(property.icon);
            if (label != property.label) setLabel(property.label);
            if (description != property.description)
                setDescription(property.description);

            if (
                images.length != property.images.length ||
                !images.every(image => property.images.includes(image))
            ) {
                setImages(property.images);
            }
        }
    }, [property]);

    const handleIconChange = ({ native }: any) => setIcon(native);

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
        setDescription(event.target.value);

    const handleFileChange = (file: File | null) => {
        setImage(file);
    };

    const handleFileDropped = (files: FileWithPath[]) => {
        setImage(files[0]);
    };

    const handleFileRejected = (files: FileRejection[]) => {
        if (files[0].errors[0].code == ErrorCode.TooManyFiles) {
            showNotification({
                title: files[0].errors[0].message,
                message: "Try uploading one image at a time. Sorry 😅",
                color: "red"
            });
        }
    };

    // TODO: Update this function to do the following
    // 1. Upload file to cloudinary or some cloud image hosting platform
    // 2. Get URL to the image
    // 3. Add the URL to the list of image URLs
    const handleSaveImage = () => {
        setImages([...images, URL.createObjectURL(image!)]);
    };

    console.log({ hovered, ref });

    return (
        <div className={classes.wrapper}>
            <Title>Your property details</Title>
            <Text color={"dimmed"}>
                This information will be used for our cleaners and yourself.
            </Text>
            <div className={classes.container}>
                <ScrollArea h={"100%"} scrollbarSize={8}>
                    <Grid w={"100%"} columns={11}>
                        <Grid.Col span={3}>
                            <Title order={6}>
                                Identifier{" "}
                                <span style={{ color: "red" }}>*</span>
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <HoverCard>
                                <HoverCard.Target>
                                    <Paper className={classes.icon}>
                                        <Text>{icon}</Text>
                                    </Paper>
                                </HoverCard.Target>
                                <HoverCard.Dropdown
                                    className={classes.dropdown}
                                >
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
                        <Grid.Col span={3}>
                            <Title order={6}>
                                Label <span style={{ color: "red" }}>*</span>
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <TextInput
                                size={"sm"}
                                variant={"filled"}
                                value={label}
                                onChange={handleLabelChange}
                                error={
                                    label.length == 0 &&
                                    "Property Label cannot be empty"
                                }
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Title order={6}>Description</Title>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Textarea
                                value={description ?? ""}
                                variant={"filled"}
                                onChange={handleDescriptionChange}
                                autosize
                                minRows={2}
                                maxRows={4}
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Title order={6}>Images</Title>
                        </Grid.Col>
                        <Grid.Col span={8}>
                            {image ? (
                                <DisplayImage
                                    handleCancel={() => setImage(null)}
                                    handleSave={handleSaveImage}
                                    image={image}
                                />
                            ) : (
                                <FileButton
                                    onChange={handleFileChange}
                                    accept="image/png,image/jpeg"
                                >
                                    {props => (
                                        <Center
                                            className={classes.dropzoneHolder}
                                            {...props}
                                        >
                                            <Stack
                                                align={"center"}
                                                spacing={0}
                                                style={{
                                                    pointerEvents: "none"
                                                }}
                                            >
                                                <TbUpload
                                                    size={50}
                                                    className={classes.dropIcon}
                                                />

                                                <Text mt={20} size="xl" inline>
                                                    Drag image here or click to
                                                    select image
                                                </Text>
                                                <Text
                                                    size="sm"
                                                    color="dimmed"
                                                    inline
                                                    mt={8}
                                                >
                                                    Attach one image at a time,
                                                    each file should not exceed
                                                    5mb
                                                </Text>
                                            </Stack>
                                        </Center>
                                    )}
                                </FileButton>
                            )}
                            <Text size={"xs"} c={"dimmed"} mt={4}>
                                Upload images and preview them before saving it
                                to your property
                            </Text>

                            <Dropzone.FullScreen
                                multiple={false}
                                onDrop={handleFileDropped}
                                onReject={handleFileRejected}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                classNames={{
                                    root: classes.dropzone,
                                    inner: classes.dropzone
                                }}
                            >
                                <Center h={"100%"}>
                                    <Stack
                                        align={"center"}
                                        spacing={0}
                                        style={{ pointerEvents: "none" }}
                                    >
                                        <Dropzone.Accept>
                                            <TbUpload
                                                size={50}
                                                className={classes.dropIcon}
                                            />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <TbX
                                                size={50}
                                                className={
                                                    classes.dropRejectIcon
                                                }
                                            />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <TbUpload
                                                size={50}
                                                className={classes.dropIcon}
                                            />
                                        </Dropzone.Idle>

                                        <Text mt={20} size="xl" inline>
                                            Drag image here or click to select
                                            image
                                        </Text>
                                        <Text
                                            size="sm"
                                            color="dimmed"
                                            inline
                                            mt={8}
                                        >
                                            Attach one image at a time, each
                                            file should not exceed 5mb
                                        </Text>
                                    </Stack>
                                </Center>
                            </Dropzone.FullScreen>
                        </Grid.Col>
                    </Grid>
                </ScrollArea>
            </div>
        </div>
    );
};

const DisplayImage: FC<{
    handleSave: () => void;
    handleCancel: () => void;
    image: File;
}> = ({ handleCancel, handleSave, image }) => {
    const { classes } = useStyles();
    const { hovered, ref } = useHover();

    return (
        <div ref={ref} className={classes.imageWrapper}>
            <Transition
                mounted={hovered}
                transition="fade"
                duration={400}
                timingFunction="ease"
            >
                {styles => (
                    <div style={styles} className={classes.imageOverlay}>
                        <Button
                            color={"green"}
                            variant={"outline"}
                            onClick={handleSave}
                        >
                            Save image
                        </Button>
                        <Button
                            color={"red"}
                            variant={"outline"}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </Transition>
            <Image src={URL.createObjectURL(image)} />
        </div>
    );
};
