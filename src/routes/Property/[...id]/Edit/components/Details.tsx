import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Carousel, Embla } from "@mantine/carousel";
import {
    ActionIcon,
    Center,
    createStyles,
    FileButton,
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
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

import axios from "axios";
import { ChangeEvent, FC, ReactNode, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbPhoto, TbTrash, TbUpload, TbX } from "react-icons/tb";

import { EditPropertyContext } from "../../components/PropertyProvider";

type FileRejection = {
    file: File;
    errors: { message: string; code: string }[];
};

const useCarouselStyles = createStyles(theme => ({
    container: {
        height: "100%",
        width: "100%"
    },
    control: {
        borderRadius: theme.radius.sm
    },
    controls: {},
    indicator: {},
    indicators: {},
    root: {
        height: "100%",
        width: "100%",
        borderRadius: theme.radius.sm,
        overflow: "hidden"
    },
    slide: {
        overflow: "hidden",
        position: "relative",
        borderRadius: theme.radius.sm
    },
    viewport: {
        height: "100%",
        width: "100%"
    }
}));

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

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { paddingInline: theme.spacing.xs }
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
        borderRadius: 4
    },
    labels: {
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: 2 * theme.spacing.xs
    },
    step: {
        fontSize: 16,
        fontWeight: 500
    },
    title: {
        fontSize: 32,
        fontWeight: 700,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 24 }
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 400,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: { fontSize: 14 }
    },
    buttonContainer: {
        gap: theme.spacing.sm,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            flexDirection: "row"
        }
    },
    carouselContainer: {
        flex: 1,
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden"
    },
    carouselWrapper: {
        width: "100%",
        height: "100%",
        display: "flex",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme == "dark" ? theme.colors.dark[6] : "white",
        border: `1px solid ${theme.colorScheme == "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            flexDirection: "column",
            alignItems: "center"
        }
    },
    placeholderWrapper: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        border: `2px dashed ${theme.colorScheme == "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`
    },
    placeholderContent: {
        display: "flex",
        maxWidth: "80%",
        userSelect: "none",
        alignItems: "center",
        gap: theme.spacing.sm
    },
    dropzone: {
        height: "100%",
        width: "100%"
    },
    dropIcon: {
        color: theme.colors.indigo[theme.colorScheme === "dark" ? 4 : 6]
    },
    dropRejectIcon: {
        color: theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    },
    image: {
        zIndex: 1,
        height: "100%",
        width: "100%",
        objectFit: "cover",
        objectPosition: "center"
    }
}));

export const Details: FC = () => {
    const { classes } = useStyles();
    const [loaded, setLoaded] = useState(false);
    const [cookies] = useCookies(["AccessToken"]);
    const { colorScheme } = useMantineColorScheme();
    const { classes: carouselClasses } = useCarouselStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    // input values
    const [icon, setIcon] = useState(property?.icon ?? "");
    const [label, setLabel] = useState(property?.label ?? "");
    const [description, setDescription] = useState(property?.description ?? "");

    // debounced values
    const [debouncedIcon] = useDebouncedValue(icon, 500);
    const [debouncedLabel] = useDebouncedValue(label, 500);
    const [debouncedDescription] = useDebouncedValue(description, 500);

    const [embla, setEmbla] = useState<Embla | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (property) setImages(property.images);
    }, [property]);

    useEffect(() => {
        if (!loaded) setLoaded(true);
    }, [debouncedDescription, debouncedIcon, debouncedLabel]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/${property?.id}`,
                { icon: debouncedIcon },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedIcon]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/${property?.id}`,
                { label: debouncedLabel },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedLabel]);

    useEffect(() => {
        if (loaded) {
            axios.put(
                `${import.meta.env.VITE_PROPERTY_API}/${property?.id}`,
                { description: debouncedDescription },
                { headers: { authorization: `Bearer ${cookies.AccessToken}` } }
            );
        }
    }, [debouncedDescription]);

    const handleSaveFiles = async (files: File[]) => {
        setUploading(true);

        const formDatas: Promise<void>[] = files.map(file => {
            const fData = new FormData();

            fData.append("file", file);

            return axios
                .post(`${import.meta.env.VITE_PROPERTY_API}/${property?.id}/image`, fData, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data: { images } }) => {
                    dispatch({ type: "setImage", payload: images });
                })
                .catch(({ response: { data } }) => {
                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "red"
                    });
                });
        });

        await Promise.allSettled(formDatas).then(() => {
            setUploading(false);
        });
    };

    const handleRejectFiles = (files: FileRejection[]) => {
        showNotification({
            title: `Error code: ${files[0].errors[0].code}`,
            message: files[0].errors[0].message,
            color: "red"
        });
    };

    const handleDeleteFile = () => {
        const index = embla?.selectedScrollSnap();
        if (index != undefined) {
            const targetURL = images[index];
            setDeleting(true);

            axios
                .post(
                    `${import.meta.env.VITE_PROPERTY_API}/${property?.id}/image`,
                    { url: targetURL },
                    { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
                )
                .then(({ data: { images } }) => {
                    setDeleting(false);

                    dispatch({ type: "setImage", payload: images });
                })
                .catch(({ response: { data } }) => {
                    setDeleting(false);

                    showNotification({
                        title: data.type,
                        message: data.message,
                        color: "red"
                    });
                });
        }
    };

    const handleIconChange = ({ native }: { native: string }) => {
        dispatch({ type: "details", payload: { icon: native } });

        setIcon(native);
    };

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "details", payload: { label: event.target.value } });

        setLabel(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: "details", payload: { description: event.target.value } });

        setDescription(event.target.value);
    };

    return (
        <div className={classes.wrapper}>
            <Grid mt={"md"} maw={768} columns={11} grow>
                <Grid.Col span={11} className={classes.labels}>
                    <Title className={classes.step}>Step 1</Title>
                    <Title className={classes.title}>Tell us about your place</Title>
                    <Text className={classes.subtitle} color={"dimmed"}>
                        Edit the identifier, label, description and add some photos of your property.
                    </Text>
                </Grid.Col>
                <Row req label={"Identifier"}>
                    <Stack spacing={4}>
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
                    </Stack>
                </Row>
                <Row req label={"Label"}>
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
                <Row label={"Description"}>
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
                <Row label={"Images"}>
                    <Stack spacing={4}>
                        <div className={classes.carouselWrapper}>
                            <div className={classes.carouselContainer}>
                                {images.length > 0 ? (
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        loop={images.length > 5}
                                        withIndicators
                                        classNames={carouselClasses}
                                    >
                                        {images.map((url, i) => (
                                            <Carousel.Slide key={i}>
                                                <img src={url} className={classes.image} />
                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <div className={classes.placeholderWrapper}>
                                        <div className={classes.placeholderContent}>
                                            <TbPhoto size={48} />
                                            <Text
                                                inline
                                                size={"sm"}
                                                color={"dimmed"}
                                                sx={{ [`@media (max-width: 480px)`]: { display: "none" } }}
                                            >
                                                Attach as many files as you like, each file should not exceed 5mb
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={classes.buttonContainer}>
                                <FileButton multiple onChange={handleSaveFiles} accept="image/png,image/jpeg">
                                    {props => (
                                        <ActionIcon size={"lg"} variant={"outline"} color={"green"} loading={uploading}>
                                            <TbUpload {...props} />
                                        </ActionIcon>
                                    )}
                                </FileButton>
                                <ActionIcon
                                    size={"lg"}
                                    color={"red"}
                                    loading={deleting}
                                    variant={"outline"}
                                    onClick={handleDeleteFile}
                                    disabled={images.length < 1}
                                >
                                    <TbTrash />
                                </ActionIcon>
                            </div>
                        </div>
                        <Dropzone.FullScreen
                            multiple
                            onDrop={handleSaveFiles}
                            onReject={handleRejectFiles}
                            maxSize={3 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                            classNames={{
                                root: classes.dropzone,
                                inner: classes.dropzone
                            }}
                        >
                            <Center h={"100%"}>
                                <Stack spacing={0} align={"center"}>
                                    <Dropzone.Accept>
                                        <TbUpload size={50} className={classes.dropIcon} />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <TbX size={50} className={classes.dropRejectIcon} />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <TbUpload size={50} className={classes.dropIcon} />
                                    </Dropzone.Idle>

                                    <Text mt={20} size="xl" inline>
                                        Drag images here
                                    </Text>
                                    <Text size="sm" color="dimmed" inline mt={8}>
                                        Attach as many images as you like, each file should not exceed 5mb
                                    </Text>
                                </Stack>
                            </Center>
                        </Dropzone.FullScreen>
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
    label: string;
    req?: boolean;
    children: ReactNode | undefined;
};

const Row: FC<RowProps> = ({ label, req, children }) => {
    return (
        <>
            <Grid.Col
                span={3}
                sx={theme => ({ [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "none" } })}
            >
                <Title order={6}>
                    {label} {req && <span style={{ color: "red" }}>*</span>}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>
                <Stack spacing={4}>
                    <Title
                        order={6}
                        sx={theme => ({
                            display: "none",
                            [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "block" }
                        })}
                    >
                        {label} {req && <span style={{ color: "red" }}>*</span>}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
