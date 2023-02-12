import {
    Button,
    Container,
    Flex,
    Grid,
    Group,
    ScrollArea,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title
} from "@mantine/core";
import { FC, PropsWithChildren, useContext } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { BookingContext } from "../Provider";

export const AdditionalInformationStep: FC = () => {
    const { contact, info, setContact, setInfo, setStep } = useContext(BookingContext);
    return (
        <ScrollArea h="100%" scrollbarSize={6}>
            <Container size="sm" p={{ base: "xs", xs: "lg" }}>
                <Title ff="Inter">Anything else we should know?</Title>
                <Text color="dimmed">
                    Provide us with a secondary contact, give our cleaners a heads up on any special situations, or let
                    us know if you have any questions.
                </Text>
                <Grid my={"lg"} maw={768} columns={11} grow>
                    <Row label={"Secondary Contact"}>
                        <TextInput
                            size={"sm"}
                            value={contact}
                            variant={"default"}
                            onChange={e => setContact(e.target.value)}
                        />
                        <Text size="sm" color="dimmed">
                            We'll contact your preferred contact as well as this secondary contact if necessary
                        </Text>
                    </Row>
                    <Row label={"Additional information"}>
                        <Textarea
                            value={info}
                            variant={"default"}
                            onChange={e => setInfo(e.target.value)}
                            autosize
                            minRows={6}
                            maxRows={12}
                        />
                        <Text size="sm" color="dimmed">
                            We'll contact you on your preferred contact as well as this secondary contact if necessary
                        </Text>
                    </Row>
                </Grid>

                <Flex justify="end" display={{ base: "none !important", sm: "flex !important" }}>
                    <Group>
                        <Button variant="outline" leftIcon={<TbChevronLeft />} onClick={() => setStep(2)}>
                            Previous
                        </Button>
                        <Button variant="outline" rightIcon={<TbChevronRight />} onClick={() => setStep(4)}>
                            Next
                        </Button>
                    </Group>
                </Flex>
            </Container>
        </ScrollArea>
    );
};

interface RowProps extends PropsWithChildren {
    label: string;
}

const Row: FC<RowProps> = ({ label, children }) => {
    return (
        <>
            <Grid.Col
                span={3}
                sx={theme => ({ [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "none" } })}
            >
                <Title ff="Inter" order={6}>
                    {label}
                </Title>
            </Grid.Col>
            <Grid.Col span={8}>
                <Stack spacing={4}>
                    <Title
                        ff="Inter"
                        order={6}
                        sx={theme => ({
                            display: "none",
                            [`@media (max-width: ${theme.breakpoints.xs}px)`]: { display: "block" }
                        })}
                    >
                        {label}
                    </Title>
                    {children}
                </Stack>
            </Grid.Col>
        </>
    );
};
