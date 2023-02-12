import {
    ActionIcon,
    Button,
    Center,
    Container,
    createStyles,
    Flex,
    Group,
    NumberInput,
    Paper,
    ScrollArea,
    Skeleton,
    Stack,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import { FC, Fragment, useContext, useEffect, useState } from "react";
import { TbChevronLeft, TbChevronRight, TbMinus, TbPlus } from "react-icons/tb";
import { ServiceType } from "~/models";
import { BookingContext } from "../Provider";

type ServiceCategory = { title: string; services: Omit<ServiceType, "created_at" | "updated_at">[] };

export const SelectServicesStep: FC = () => {
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const { steps, services, setStep, setSteps } = useContext(BookingContext);

    useEffect(() => {
        let newItems: ServiceCategory[] = [];

        services.forEach(item => {
            const index = newItems.findIndex(serviceCategory => item.category == serviceCategory.title);

            if (index === -1) {
                newItems.push({
                    title: item.category,
                    services: [item]
                });
            } else {
                newItems[index].services.push(item);
            }
        });

        setServiceCategories(newItems);
    }, []);

    useEffect(() => {
        let newSteps = [...steps];

        newSteps[1].completed = true;

        setSteps(newSteps);
    }, []);

    return (
        <ScrollArea h="100%" scrollbarSize={6}>
            <Container size="sm" p={{ base: "xs", sm: "lg" }}>
                <Title ff="Inter">Do you need anything else?</Title>
                <Text color="dimmed">
                    You can add additional services to your booking. These services will be added to your final bill.
                </Text>
                <Stack spacing={16} my="lg">
                    {serviceCategories.length > 0
                        ? serviceCategories.map(categoryWServices => (
                              <Fragment key={categoryWServices.title}>
                                  <Text
                                      fw={500}
                                      sx={theme => ({ color: theme.colorScheme == "dark" ? "white" : "black" })}
                                  >
                                      {categoryWServices.title}
                                  </Text>
                                  <Stack spacing={8}>
                                      {categoryWServices.services.map(s => (
                                          <ServiceItem service={s} key={s.id} />
                                      ))}
                                  </Stack>
                              </Fragment>
                          ))
                        : [...new Array(3).keys()].map(i => (
                              <Fragment key={i}>
                                  <Stack spacing={8}>
                                      <Skeleton maw={250} h={28} />
                                      {[...new Array(Math.round(Math.random() * 2 + 1)).keys()].map(s => (
                                          <Skeleton key={s} h={64} />
                                      ))}
                                  </Stack>
                              </Fragment>
                          ))}
                </Stack>

                <Flex justify="end" display={{ base: "none", sm: "flex" }}>
                    <Group>
                        <Button variant="outline" leftIcon={<TbChevronLeft />} onClick={() => setStep(1)}>
                            Previous
                        </Button>
                        <Button variant="outline" rightIcon={<TbChevronRight />} onClick={() => setStep(3)}>
                            Next
                        </Button>
                    </Group>
                </Flex>
            </Container>
        </ScrollArea>
    );
};

const useItemStyles = createStyles((theme, { selected }: { selected: boolean }) => ({
    wrapper: {
        display: "flex",
        transition: "0.3s ease",
        boxShadow: selected ? "0 0 6px 0px rgba(255, 255, 255, 0.2)" : undefined
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        borderRadius: theme.radius.sm
    },
    group: {
        gap: 12,
        width: "100%",
        alignItems: "start",
        flexDirection: "column"
    },
    input: {
        width: 36,
        textAlign: "center",
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]
    }
}));

const ServiceItem: FC<{ service: Omit<ServiceType, "created_at" | "updated_at"> }> = ({ service }) => {
    const theme = useMantineTheme();
    const { selectedServices, setSelectedServices } = useContext(BookingContext);
    const [value, setValue] = useState(selectedServices.find(s => s.id == service.id)?.quantity ?? 0);
    const { classes } = useItemStyles({ selected: value > 0 });

    useEffect(() => {
        let newSelectedServices = [...selectedServices];

        const index = newSelectedServices.findIndex(s => s.id == service.id);

        if (index !== -1) {
            if (value > 0) newSelectedServices[index].quantity = value;
            else newSelectedServices.splice(index, 1);
        } else {
            newSelectedServices.push({ id: service.id, quantity: value });
        }

        setSelectedServices(newSelectedServices);
    }, [value]);

    const handleClick = (action: "add" | "remove") => () => {
        if (action === "add") {
            if (service.quantifiable) setValue(value >= 10 ? value : value + 1);
            else {
                if (value > 0) setValue(0);
                else setValue(1);
            }
        } else {
            if (value > 0) setValue(value - 1);
        }
    };

    const handleChange = (num: number) => setValue(num);

    return (
        <Paper py={4} px="sm" withBorder radius="sm" className={classes.wrapper}>
            <Flex className={classes.group} py={4}>
                <Text>
                    <Text
                        span
                        size="md"
                        sx={{ transition: "0.2s ease" }}
                        color={value > 0 ? (theme.colorScheme == "dark" ? "white" : "black") : undefined}
                    >
                        {service.label}
                    </Text>{" "}
                    <Text span size="xs" color="dimmed" style={{ wordBreak: "keep-all", lineBreak: "strict" }}>
                        (${service.price.toFixed(2)} / unit)
                    </Text>
                </Text>
                <Group spacing={4}>
                    {service.products.map((product, index) => (
                        <Text size="sm" color="dimmed" lh={1.2} key={index}>
                            {product.quantity} {product.label}
                            {index < service.products.length - 1 ? "," : ""}
                        </Text>
                    ))}
                </Group>
            </Flex>
            {service.quantifiable ? (
                <Center>
                    <div className={classes.buttonGroup}>
                        <ActionIcon onClick={handleClick("remove")}>
                            <TbMinus />
                        </ActionIcon>
                        <NumberInput
                            min={0}
                            max={10}
                            value={value}
                            onChange={handleChange}
                            variant="unstyled"
                            autoComplete={"off"}
                            classNames={{ input: classes.input }}
                        />
                        <ActionIcon onClick={handleClick("add")}>
                            <TbPlus />
                        </ActionIcon>
                    </div>
                </Center>
            ) : (
                <Center>
                    <ActionIcon size="lg" variant="outline" radius={6} onClick={handleClick("add")}>
                        {value > 0 ? <TbMinus /> : <TbPlus />}
                    </ActionIcon>
                </Center>
            )}
        </Paper>
    );
};
