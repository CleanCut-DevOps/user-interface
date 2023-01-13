import { Carousel, Embla } from "@mantine/carousel";
import { ActionIcon, Center, createStyles, FileButton, Stack, Text, Tooltip } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useViewportSize } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TbPhoto, TbTrash, TbUpload, TbX } from "react-icons/tb";
import { EditPropertyContext } from "../components";

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
        width: "100%",
        height: "100%",
        display: "flex",
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme == "dark" ? theme.colors.dark[6] : "white",
        border: `1px solid ${theme.colorScheme == "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,

        [`@media (max-width: 815px)`]: {
            flexDirection: "column",
            alignItems: "center"
        }
    },
    buttonContainer: {
        gap: theme.spacing.sm,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        [`@media (max-width: 815px)`]: {
            flexDirection: "row"
        }
    },
    carouselWrapper: {
        flex: 1,
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden"
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

export const ImagesPreview: FC = () => {
    const { classes } = useStyles();
    const [cookies] = useCookies(["AccessToken"]);
    const { classes: carouselClasses } = useCarouselStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    const [embla, setEmbla] = useState<Embla | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (property) setImages(property.images);
    }, [property]);

    const handleSaveFiles = async (files: File[]) => {
        setUploading(true);

        const formDatas: Promise<void>[] = files.map(file => {
            const fData = new FormData();

            fData.append("file", file);
            fData.append("id", property?.id ?? "");

            return axios
                .post(`${import.meta.env.VITE_PROPERTY_API}/image/add`, fData, {
                    headers: { Authorization: `Bearer ${cookies.AccessToken}` }
                })
                .then(({ data: { secureURL } }) => {
                    dispatch({ type: "addImage", payload: secureURL });
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
                    `${import.meta.env.VITE_PROPERTY_API}/image/remove`,
                    { id: property?.id, url: targetURL },
                    { headers: { Authorization: `Bearer ${cookies.AccessToken}` } }
                )
                .then(() => {
                    setDeleting(false);

                    dispatch({ type: "removeImage", payload: targetURL });
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

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.carouselWrapper}>
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
                    <Tooltip label={"Upload image"} position={"right"} color={"gray"} withArrow>
                        <div>
                            <FileButton multiple onChange={handleSaveFiles} accept="image/png,image/jpeg">
                                {props => (
                                    <ActionIcon size={"lg"} variant={"outline"} color={"green"} loading={uploading}>
                                        <TbUpload {...props} />
                                    </ActionIcon>
                                )}
                            </FileButton>
                        </div>
                    </Tooltip>
                    <Tooltip label={"Remove image"} position={"right"} color={"gray"} withArrow>
                        <div>
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
                    </Tooltip>
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
        </>
    );
};
