import {
    Autocomplete,
    Button,
    Center,
    createStyles,
    Flex,
    Group,
    Paper,
    SelectItemProps,
    Stack,
    Text,
    Title
} from "@mantine/core";

import { FC, forwardRef, useContext, useState } from "react";
import { TbChevronRight } from "react-icons/tb";

import { BookingContext } from "../Provider";

const useStyles = createStyles(theme => ({
    wrapper: {
        gap: 32,
        height: "100%",
        width: "100%",
        maxWidth: 768,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        padding: theme.spacing.lg,
        boxShadow: theme.shadows.xs,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",

        [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            maxHeight: 400
        }
    }
}));

export const SelectPropertyStep: FC = () => {
    const { classes } = useStyles();
    const { selectedProperty, properties, setSelectedProperty, setStep } = useContext(BookingContext);
    const [value, setValue] = useState<string>(selectedProperty?.label ?? "");

    return (
        <Center p={{ base: "xs", sm: "lg" }} h={"100%"}>
            <Paper withBorder className={classes.wrapper}>
                <Stack spacing={2} align="center">
                    <Title order={3} ff="Inter" ta="center">
                        Book online
                    </Title>
                    <Text color="dimmed" ta="center">
                        Let's get started by selecting which property you want to book.
                    </Text>
                </Stack>
                <Flex gap="md" direction={{ base: "column", xs: "row" }}>
                    <Autocomplete
                        w={{ base: 250, xs: 300, md: 350 }}
                        placeholder="Pick one"
                        itemComponent={AutoCompleteItem}
                        value={value}
                        onChange={setValue}
                        data={[...properties].map(p => ({
                            id: p.id,
                            value: p.label,
                            icon: p.icon,
                            city: p.address.city!
                        }))}
                        filter={(value, item) => item.value.toLowerCase().includes(value.toLowerCase().trim())}
                        onItemSubmit={item => {
                            setSelectedProperty(properties.find(p => p.id === item.id)!);
                        }}
                        onBlur={() => {
                            setValue(selectedProperty?.label ?? value);
                        }}
                        transition="pop"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                    />
                    <Button
                        variant="outline"
                        disabled={selectedProperty == null}
                        onClick={() => setStep(1)}
                        rightIcon={<TbChevronRight />}
                    >
                        Next
                    </Button>
                </Flex>
            </Paper>
        </Center>
    );
};

interface ItemProps extends SelectItemProps {
    value: string;
    icon: string;
    city: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(({ value, icon, city, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
        <Group noWrap>
            <Text>{icon}</Text>
            <div>
                <Text>{value}</Text>
                <Text size="xs" color="dimmed">
                    {city}
                </Text>
            </div>
        </Group>
    </div>
));
