import {
    ActionIcon,
    Center,
    createStyles,
    FileButton,
    Stack,
    Text,
    Tooltip
} from "@mantine/core";
import { FC, useContext, useEffect, useState } from "react";
import { TbCheck, TbTrash, TbUpload, TbX } from "react-icons/tb";
import { EditPropertyContext } from "../components/Provider";
import { FullScreenDropzone } from "./Dropzone";

const useStyles = createStyles(theme => ({
    wrapper: {
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.radius.sm,
        border:
            theme.colorScheme === "dark"
                ? `1px solid ${theme.colors.dark[4]}`
                : `1px solid ${theme.colors.gray[4]}`,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
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
            height: 8,
            backgroundColor: "transparent"
        },

        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.colors.gray[5],
            borderRadius: 8
        },

        "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.colors.gray[6]
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
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : "white",
        border:
            theme.colorScheme === "dark"
                ? `2px dashed ${theme.colors.dark[3]}`
                : `2px dashed ${theme.colors.gray[3]}`,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[0]
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
        aspectRatio: "16 / 10",
        objectFit: "cover",
        objectPosition: "center"
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
        objectPosition: "center",
        borderRadius: theme.radius.sm
    }
}));

export const ImagePreview: FC = () => {
    const { classes } = useStyles();
    const { property, dispatch } = useContext(EditPropertyContext);

    const [selected, setSelected] = useState<File | string | null>(null);
    const [images, setImages] = useState<File[]>([]);
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
            // TODO: Upload image to server
            const url = URL.createObjectURL(selected);

            // Set hosted image url to the array
            setSImages([...savedImages, url]);
            setImages(images.filter(image => image != selected));
            setSelected(null);
        }
    };

    const handleTrash = () => {
        if (selected && typeof selected == "object") {
            setImages(images.filter(image => image != selected));
            setSelected(null);
        } else if (selected && typeof selected == "string") {
            setSImages(savedImages.filter(image => image != selected));
            setSelected(null);
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
                                src={
                                    typeof selected == "string"
                                        ? selected
                                        : URL.createObjectURL(selected)
                                }
                            />
                        ) : (
                            <FileButton
                                multiple
                                onChange={handleFileChange}
                                accept="image/png,image/jpeg"
                            >
                                {props => (
                                    <Center
                                        className={classes.dropzoneHolder}
                                        {...props}
                                    >
                                        <TbUpload
                                            size={50}
                                            className={classes.dropIcon}
                                        />

                                        <Text
                                            mt={20}
                                            size="lg"
                                            inline
                                            sx={{ textAlign: "center" }}
                                        >
                                            Drag images here or click to select
                                            images
                                        </Text>
                                        <Text
                                            size="xs"
                                            color="dimmed"
                                            inline
                                            mt={8}
                                            sx={{ textAlign: "center" }}
                                        >
                                            Attach as many images as you like,
                                            each file should not exceed 5mb
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
                                    disabled={
                                        !selected || typeof selected == "string"
                                    }
                                    onClick={handleSave}
                                >
                                    <TbCheck />
                                </ActionIcon>
                            </div>
                        </Tooltip>
                        <Tooltip
                            withArrow
                            position={"right"}
                            label={
                                typeof selected == "string"
                                    ? "Remove image"
                                    : "Cancel"
                            }
                        >
                            <div>
                                <ActionIcon
                                    variant={"outline"}
                                    color={"red"}
                                    onClick={handleTrash}
                                    disabled={!selected}
                                >
                                    {typeof selected == "string" &&
                                    savedImages.includes(selected) ? (
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
                                    draggable={false}
                                    src={image}
                                    alt={"Preview image"}
                                    className={classes.sliderImage}
                                    onClick={handleSelect(image)}
                                />
                            );
                        })}
                        {images.map((image, i) => {
                            return (
                                <img
                                    key={i}
                                    draggable={false}
                                    alt={"Preview image"}
                                    className={classes.sliderImage}
                                    src={URL.createObjectURL(image)}
                                    onClick={handleSelect(image)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <FullScreenDropzone images={images} setImages={setImages} />
        </>
    );
};
