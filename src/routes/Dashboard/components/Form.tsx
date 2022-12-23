import { FC } from "react";
import {
    Box,
    Button,
    Checkbox,
    createStyles,
    Group,
    PasswordInput,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";
import { Link } from "wouter";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useCookies } from "react-cookie";
import { showNotification } from "@mantine/notifications";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

interface RequestData {
    House: string;
    Rooms: string;
    Address: string;
    Time:string

    
}

const useStyles = createStyles(() => ({
    panelLabel: {
        fontSize: 28,
        fontWeight: 600
    },
    formPanel: {
        flex: 1,
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    formContainer: {
        display: "flex",
        minWidth: "560px",
        flexDirection: "column",
        gap: 36
    },
    link: {
        textDecoration: "none",
        color: "#3c37ff",
        fontWeight: 600,
        transition: "all 0.2s ease",
        "&:hover": {
            color: "#2520e3",
            textDecoration: "underline"
        }
    },
    submit: {
        backgroundColor: "#3c37ff",
        color: "white",
        transition: "all 0.2s ease",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
        "&:hover": {
            backgroundColor: "#2520e3"
        }
    }
    
}));

export const Booking: FC = () => {
    const { classes } = useStyles();
    

    const form = useForm({
        initialValues: {
            
            House: "",
            Rooms: "",
            Address: "",
            Time: "",
            
            
        },
      

    });

    const handleSubmit = form.onSubmit(({ House, Rooms, Address, Time }) => {
        let fData: RequestData = {
            House, 
            Rooms, 
            Address,
            Time,
           
        };
        axios
        .post("https://booking-api.klenze.com.au/", fData)
        .then(({ data }) => {
            const token = data.token;
            showNotification({
                title: data.type,
                message: data.message,
                color: "green"
            });
        })
        .catch(({ response }) => {
            console.log(response);
        });
    
        
    });

    return (
        <Box className={classes.formPanel}>
            <Box className={classes.formContainer}>
                <Stack spacing={12}>
                    <Text className={classes.panelLabel}>Booking</Text>
                    <Text fw={500} color={"#777"}>
                        Book our cleaning services{" "}    
                    </Text>
                </Stack>
                
                <form onSubmit={handleSubmit}>
                    <Stack spacing={24}>
                    <Select
                            size={"md"}
                            label="Type of cleaning"
                            placeholder="HDB "
                            data={[
                                { value: 'HDB', label: 'HDB' },
                                { value: 'Condo', label: 'Condo' },
                                { value: 'Landed', label: 'Landed' },
                                { value: 'Office', label: 'Office' },
                              ]}
                              />
                        <TextInput
                            size={"md"}
                            label="Rooms"
                            placeholder="5 rooms"
                            {...form.getInputProps("rooms")}
                        />
                        <TextInput
                            size={"md"}
                            label="Address"
                            placeholder="21 Tampines Ave 1, Singapore 529757"
                            {...form.getInputProps("address")}
                              />
                        <TextInput
                            size={"md"}
                            label="Date and time"
                            placeholder="29th August 12pm"
                            {...form.getInputProps("address")}
                              />
                         <Textarea
                            label="Specifications"
                            placeholder="Do not clean third floor"
                            {...form.getInputProps("specification")}
                              />
                              
                        <Button
                            fullWidth
                            size={"md"}
                            type={"submit"}
                            color={"indigo"}
                            className={classes.submit}>
                            Book
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};