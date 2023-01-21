import { ActionIcon, Alert, Button, createStyles, Input, Menu, Modal, Text } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { ChangeEvent, FC, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { TbAlertCircle, TbDots, TbEdit, TbEye, TbTrash } from "react-icons/tb";
import { useLocation } from "wouter";
import { Property } from "../../../models";
import { PropertyCollectionContext } from "./Provider";

type ComponentProps = {
    prop: Property;
};

const useStyles = createStyles(theme => ({
    cardActionIcon: {
        border: theme.colorScheme === "dark" ? `1px solid ${theme.colors.dark[4]}` : `1px solid ${theme.colors.gray[4]}`
    }
}));

export const PropMenu: FC<ComponentProps> = ({ prop }) => {
    const { classes } = useStyles();
    const [, setLocation] = useLocation();
    const [cookies] = useCookies(["AccessToken"]);
    const [confirm, setConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [confirmDebounced] = useDebouncedValue(confirm, 500);
    const [opened, { open, close }] = useDisclosure(false);
    const { refetch } = useContext(PropertyCollectionContext);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value);

    const handleView = () => setLocation(`/property/${prop.id}`);

    const handleUpdate = () => setLocation(`/property/${prop.id}/edit`);

    const handleDelete = (e: any) => {
        e.preventDefault();

        setDeleting(true);

        axios
            .delete(`${import.meta.env.VITE_PROPERTY_API}/property/${prop.id}`, {
                headers: { Authorization: `Bearer ${cookies.AccessToken}` }
            })
            .then(() => {
                setConfirm("");
                setDeleting(false);
                close();
                refetch();
            });
    };

    return (
        <>
            <Menu shadow="sm" position={"bottom-end"} width={200}>
                <Menu.Target>
                    <ActionIcon variant={"outline"} className={classes.cardActionIcon}>
                        <TbDots style={{ transform: "rotate(90deg)" }} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Details</Menu.Label>
                    <Menu.Item icon={<TbEye />} onClick={handleView}>
                        View
                    </Menu.Item>
                    <Menu.Item icon={<TbEdit />} onClick={handleUpdate}>
                        Update
                    </Menu.Item>
                    <Menu.Item color="red" icon={<TbTrash />} onClick={open}>
                        Delete property
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Modal
                centered
                opened={opened}
                onClose={close}
                title="Are you absolutely sure?
"
            >
                <Alert mt={"sm"} mb={32} icon={<TbAlertCircle />} title="Deleting property" color={"red"}>
                    <Text color={"dimmed"}>
                        This action <strong>cannot</strong> be undone. This will permanently delete the{" "}
                        <strong>{prop.label}</strong> property and everything related such as details, images and
                        bookings.
                    </Text>
                </Alert>
                <Text size={"sm"}>
                    Please type <strong>{prop.label}</strong> to confirm.
                </Text>
                <form onSubmit={handleDelete}>
                    <Input my={"xs"} value={confirm} onChange={handleChange} />
                    <Button
                        mt={4}
                        w={"100%"}
                        color={"red"}
                        loading={deleting}
                        onClick={handleDelete}
                        sx={{ transition: "0.3s ease" }}
                        disabled={confirmDebounced != prop.label || confirm != prop.label}
                    >
                        I understand the consequences, delete this property
                    </Button>
                </form>
            </Modal>
        </>
    );
};
