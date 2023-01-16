import {
    createStyles,
    Title,
    Stack,
    Skeleton,
    Group,
    Text,
    SimpleGrid,
    UnstyledButton,
    Modal,
    Center,
    ActionIcon,
    NumberInput,
    Input,
    NumberInputHandlers
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChangeEvent, FC, useRef, useState } from "react";
import { TbMinus, TbPlus } from "react-icons/tb";
import { PropertyType, RoomType } from "../../../../../models";

interface ComponentProps {
    pType: { data: PropertyType[]; isLoading: boolean; isError: boolean; isSuccess: boolean };
    typeId: string | null;
    rooms: { id: string; quantity: number }[];
    handleRoomChange: (id: string, q: number) => () => void;
}

const useStyles = createStyles(theme => ({
    labels: {
        width: "100%",
        maxWidth: 768,
        marginTop: 16,
        display: "flex",
        gap: theme.spacing.xs,
        flexDirection: "column",
        marginBottom: 2 * theme.spacing.xs
    },
    notChosen: {
        height: 100,
        width: "100%",
        display: "flex",
        fontWeight: 500,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.md,
        color: theme.colors.gray[6],
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        border: theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`
    },
    roomQuantityWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
        border: theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`
    },
    numRooms: {
        minHeight: 48,
        width: "100%",
        display: "flex",
        alignItems: "center",
        transition: "0.2s ease",
        justifyContent: "center",
        borderRadius: theme.radius.sm,
        border:
            theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
        }
    },
    chosen: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    },
    wrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `6px ${theme.spacing.xs}px`,
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]}`,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,

        "&:focus-within": {
            borderColor: theme.colors[theme.primaryColor][6]
        }
    },

    control: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3]}`,

        "&:disabled": {
            borderColor: theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[3],
            opacity: 0.8,
            backgroundColor: "transparent"
        }
    },

    input: {
        textAlign: "center",
        paddingRight: `${theme.spacing.sm}px !important`,
        paddingLeft: `${theme.spacing.sm}px !important`,
        height: 28,
        flex: 1
    }
}));

export const RoomQuantityEditors: FC<ComponentProps> = ({ pType, typeId, rooms, handleRoomChange }) => {
    const { classes } = useStyles();
    const { data, isLoading, isSuccess } = pType;

    const roomData = data?.find(p => p.id === typeId)?.rooms;
    roomData?.sort((a, b) => (a.label > b.label ? 1 : -1));

    return (
        <>
            <div className={classes.labels}>
                <Title order={4}>How many rooms do you have</Title>
            </div>

            <Stack w={"100%"} maw={768} spacing={"xl"}>
                {isLoading &&
                    [...Array(5).keys()].map(i => <Skeleton w={"100%"} key={i} height={120} radius="md" visible />)}
                {isSuccess && !typeId && <div className={classes.notChosen}>Please select a property type</div>}
                {isSuccess &&
                    typeId &&
                    roomData?.map(room => {
                        const userRoom = rooms.find(r => r.id === room.id);

                        return (
                            <RoomQuantityEditor
                                key={room.id}
                                roomData={room}
                                userRoomData={userRoom}
                                handleRoomChange={handleRoomChange}
                            />
                        );
                    })}
            </Stack>
        </>
    );
};

const RoomQuantityEditor: FC<{
    roomData: RoomType;
    userRoomData: { id: string; quantity: number } | undefined;
    handleRoomChange: (id: string, q: number) => () => void;
}> = ({ roomData, userRoomData, handleRoomChange }) => {
    const { classes } = useStyles();
    const handlers = useRef<NumberInputHandlers>(null);

    const handleCustomChange = (value: number) => {
        if (value >= 0 && value <= 20) handleRoomChange(roomData.id, value ?? 0)();
    };

    return (
        <>
            <div className={classes.roomQuantityWrapper}>
                <Group position={"apart"}>
                    <Title order={5}>{roomData.label}</Title>
                    <Text size={12} color={"dimmed"}>
                        {userRoomData?.quantity ?? 0} room{(userRoomData?.quantity ?? 0) == 1 ? "" : "s"} @ $
                        {roomData.price.toFixed(2)}
                        /room
                    </Text>
                </Group>
                <SimpleGrid
                    cols={3}
                    spacing={"md"}
                    breakpoints={[
                        { maxWidth: 420, cols: 1, spacing: "sm", verticalSpacing: "sm" },
                        { maxWidth: 600, cols: 2, spacing: "sm", verticalSpacing: "xs" }
                    ]}
                >
                    {[...Array(5).keys()].map(i => (
                        <UnstyledButton
                            key={i}
                            className={`${classes.numRooms} ${
                                userRoomData?.quantity === i + 1 ? classes.chosen : undefined
                            }`}
                            onClick={handleRoomChange(roomData.id, i + 1)}
                        >
                            {i + 1} {roomData.label.toLocaleLowerCase()}
                            {i + 1 != 1 ? "s" : ""}
                        </UnstyledButton>
                    ))}
                    <div className={classes.wrapper}>
                        <ActionIcon<"button">
                            size={28}
                            variant="transparent"
                            onClick={handleRoomChange(roomData.id, (userRoomData?.quantity ?? 1) - 1)}
                            disabled={(userRoomData?.quantity ?? 0) < 1}
                            className={classes.control}
                            onMouseDown={event => event.preventDefault()}
                        >
                            <TbMinus size={16} />
                        </ActionIcon>

                        <NumberInput
                            variant="unstyled"
                            min={0}
                            max={20}
                            handlersRef={handlers}
                            value={userRoomData?.quantity}
                            onChange={handleCustomChange}
                            classNames={{ input: classes.input }}
                        />

                        <ActionIcon<"button">
                            size={28}
                            variant="transparent"
                            onClick={handleRoomChange(roomData.id, (userRoomData?.quantity ?? 0) + 1)}
                            disabled={(userRoomData?.quantity ?? 0) > 19}
                            className={classes.control}
                            onMouseDown={event => event.preventDefault()}
                        >
                            <TbPlus size={16} />
                        </ActionIcon>
                    </div>
                </SimpleGrid>
            </div>
        </>
    );
};
