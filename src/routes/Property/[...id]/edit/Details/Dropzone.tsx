import { Center, createStyles, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import { FC } from "react";
import { TbUpload, TbX } from "react-icons/tb";

type ComponentProps = {
    images: File[];
    setImages: (images: File[]) => void;
};

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
    dropzone: {
        height: "100%",
        width: "100%"
    },
    dropIcon: {
        color: theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
        ]
    },
    dropRejectIcon: {
        color: theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    }
}));

export const FullScreenDropzone: FC<ComponentProps> = ({
    images,
    setImages
}) => {
    const { classes } = useStyles();

    const handleFilesDropped = (files: FileWithPath[]) => {
        setImages([...(images ?? []), ...files]);
    };

    const handleFilesRejected = (files: FileRejection[]) => {
        showNotification({
            title: files[0].errors[0].message,
            message:
                "Please try again. If the issue persists, contact us @ tech@klenze.com.au",
            color: "red"
        });
    };

    return (
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
                        Attach as many images as you like, each file should not
                        exceed 5mb
                    </Text>
                </Stack>
            </Center>
        </Dropzone.FullScreen>
    );
};
