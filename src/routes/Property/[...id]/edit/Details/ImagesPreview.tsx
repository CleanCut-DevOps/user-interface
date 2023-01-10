import { ActionIcon, Center, createStyles, FileButton, Stack, Text, Tooltip } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { TbCheck, TbCloudUpload, TbTrash, TbUpload, TbX } from "react-icons/tb";
import { EditPropertyContext } from "../components/Provider";

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

const useStyles = createStyles(theme => ({
    wrapper: {
        width: "100%",
        minWidth: 354,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.radius.sm,
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
    },
    previewWrapper: {
        display: "flex",
        gap: theme.spacing.md,
        padding: theme.spacing.md
    },
    sliderWrapper: {
        width: "100%",
        maxWidth: 506,
        aspectRatio: "7 / 2",
        padding: theme.spacing.md
    },
    sliderContainer: {
        padding: 4,
        width: "100%",
        height: "100%",
        display: "flex",
        overflowX: "scroll",
        gap: theme.spacing.md,

        "&::-webkit-scrollbar": {
            height: 4,
            backgroundColor: "transparent"
        },

        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.colors.dark[3],
            borderRadius: 8
        },

        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.colors.dark[2]
        }
    },
    imageWrapper: {
        flex: 1,
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: theme.radius.sm
    },
    dropzoneHolder: {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        transition: "0.2s ease",
        flexDirection: "column",
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
        border:
            theme.colorScheme === "dark" ? `2px dashed ${theme.colors.dark[3]}` : `2px dashed ${theme.colors.gray[3]}`,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[0]
        },

        "&:active": {
            transform: "translateY(2px)"
        }
    },
    dropIcon: {
        color: theme.colors.indigo[theme.colorScheme === "dark" ? 4 : 6]
    },
    previewImage: {
        width: "100%",
        objectFit: "cover",
        aspectRatio: "16 / 10",
        objectPosition: "center",
        borderRadius: theme.radius.sm,
        boxShadow: `0 0 20px -2px ${theme.colors.dark[7]}`
    },
    scrollArea: {
        height: "100%"
    },
    sliderImageWrapper: {
        backgroundColor: theme.colors.dark[2]
    },
    sliderImage: {
        height: "100%",
        cursor: "pointer",
        objectFit: "cover",
        userSelect: "none",
        aspectRatio: "16 / 10",
        transition: "0.5s ease",
        objectPosition: "center",
        boxShadow: `0 0 20px -4px ${theme.colors.dark[7]}`,
        borderRadius: theme.radius.sm
    },
    activeImage: {
        padding: "1px",
        outline: `3px solid ${theme.colors.blue[6]}`
    },
    dropzone: {
        height: "100%",
        width: "100%"
    },
    dropRejectIcon: {
        color: theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    }
}));

export const ImagePreview: FC = () => {
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [trashing, setTrashing] = useState(false);
    const [selected, setSelected] = useState<File | string | null>(null);
    const [savedImages, setSImages] = useState<string[]>(property!.images);

    useEffect(() => {
        if (property) {
            if (
                savedImages.length != property.images.length ||
                !savedImages.every(images => property.images.includes(images))
            ) {
                setSImages(property.images);
            }
        }
    }, [property]);

    useEffect(() => {
        if (property) {
            if (
                savedImages.length != property.images.length ||
                !savedImages.every(images => property.images.includes(images))
            ) {
                dispatch({
                    type: "details",
                    payload: {
                        ...property,
                        images: savedImages
                    }
                });
            }
        }
    }, [savedImages]);

    const handleFilesDropped = (files: FileWithPath[]) => {
        setImages([...(images ?? []), ...files]);
    };

    const handleFilesRejected = (files: FileRejection[]) => {
        showNotification({
            title: files[0].errors[0].message,
            message: "Please try again. If the issue persists, contact us @ tech@klenze.com.au",
            color: "red"
        });
    };

    const handleFileChange = (files: File[] | null) => {
        if (files) {
            setImages([...(images ?? []), ...files]);
        } else {
            setImages([]);
        }
    };

    const handleSelect = (image: File | string) => () => setSelected(image);

    const handleSave = () => {
        if (selected && typeof selected == "object") {
            setUploading(true);

            let formData = new FormData();

            formData.append("id", property?.id ?? "");

            formData.append("file", selected);

            axios
                .post(`${import.meta.env.VITE_PROPERTY_API}/image/add`, formData)
                .then(({ data }) => {
                    dispatch({ type: "load", payload: data.property });
                    setImages(images.filter(image => image != selected));

                    setUploading(false);
                })
                .catch(({ response }) => {
                    showNotification({
                        title: response.data.type,
                        message: response.data.message
                    });

                    setUploading(false);
                });
        }
    };

    const handleTrash = () => {
        if (selected && typeof selected == "object") {
            setImages(images.filter(image => image != selected));
            setSelected(null);
        } else if (selected && typeof selected == "string") {
            setTrashing(true);

            axios
                .post(`${import.meta.env.VITE_PROPERTY_API}/image/remove`, {
                    id: property?.id ?? "",
                    url: selected
                })
                .then(({ data }) => {
                    dispatch({ type: "load", payload: data.property });

                    setTrashing(false);
                    setSelected(null);
                })
                .catch(({ response }) => {
                    showNotification({
                        title: response.data.type,
                        message: response.data.message
                    });

                    setTrashing(false);
                    setSelected(null);
                });
        }
    };

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.previewWrapper}>
                    <div className={classes.imageWrapper}>
                        {selected ? (
                            <img
                                className={classes.previewImage}
                                src={typeof selected == "string" ? selected : URL.createObjectURL(selected)}
                            />
                        ) : (
                            <FileButton multiple onChange={handleFileChange} accept="image/png,image/jpeg">
                                {props => (
                                    <Center className={classes.dropzoneHolder} {...props}>
                                        <TbUpload size={50} className={classes.dropIcon} />

                                        <Text mt={20} size="lg" inline sx={{ textAlign: "center" }}>
                                            Drag images here or click to select images
                                        </Text>
                                        <Text size="xs" color="dimmed" inline mt={8} sx={{ textAlign: "center" }}>
                                            Attach as many images as you like, each file should not exceed 5mb
                                        </Text>
                                    </Center>
                                )}
                            </FileButton>
                        )}
                    </div>
                    <Stack align={"center"} sx={{ justifyContent: "center" }}>
                        <Tooltip
                            withArrow
                            position={"right"}
                            label={
                                selected
                                    ? typeof selected == "object"
                                        ? "Save image"
                                        : "Image already saved"
                                    : "Select an image"
                            }
                        >
                            <div>
                                <ActionIcon
                                    variant={"outline"}
                                    color={"green"}
                                    disabled={!selected || typeof selected == "string"}
                                    loading={uploading}
                                    onClick={handleSave}
                                >
                                    {selected && typeof selected == "object" ? <TbCloudUpload /> : <TbCheck />}
                                </ActionIcon>
                            </div>
                        </Tooltip>
                        <Tooltip
                            withArrow
                            position={"right"}
                            label={typeof selected == "string" ? "Remove image" : "Cancel"}
                        >
                            <div>
                                <ActionIcon
                                    variant={"outline"}
                                    color={"red"}
                                    onClick={handleTrash}
                                    disabled={!selected || uploading}
                                    loading={trashing}
                                >
                                    {typeof selected == "string" && savedImages.includes(selected) ? (
                                        <TbTrash />
                                    ) : (
                                        <TbX />
                                    )}
                                </ActionIcon>
                            </div>
                        </Tooltip>
                    </Stack>
                </div>
                <div className={classes.sliderWrapper}>
                    <div className={classes.sliderContainer}>
                        {savedImages.map((image, i) => {
                            return (
                                <img
                                    key={i}
                                    src={image}
                                    draggable={false}
                                    alt={"Preview image"}
                                    onClick={handleSelect(image)}
                                    className={
                                        selected == image
                                            ? `${classes.activeImage} ${classes.sliderImage}`
                                            : classes.sliderImage
                                    }
                                />
                            );
                        })}
                        {images.map((image, i) => {
                            const url = URL.createObjectURL(image);
                            return (
                                <img
                                    key={i}
                                    src={url}
                                    draggable={false}
                                    alt={"Preview image"}
                                    onClick={handleSelect(image)}
                                    onLoad={() => URL.revokeObjectURL(url)}
                                    className={
                                        selected == image
                                            ? `${classes.activeImage} ${classes.sliderImage}`
                                            : classes.sliderImage
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <Dropzone.FullScreen
                multiple
                onDrop={handleFilesDropped}
                onReject={handleFilesRejected}
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
