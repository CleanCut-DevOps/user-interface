import { AppShell, Button, Flex, Group, Header, Stack, Stepper, Text, ThemeIcon } from "@mantine/core";

import { FC, PropsWithChildren, useContext } from "react";
import { TbCheck, TbChevronLeft, TbChevronRight, TbX } from "react-icons/tb";

import { BookingContext } from "./Provider";

interface ComponentProps extends PropsWithChildren {}

export const BookingLayout: FC<ComponentProps> = ({ children }) => {
    return (
        <AppShell
            padding={0}
            asideOffsetBreakpoint="md"
            header={<LayoutHeader />}
            styles={{ main: { height: "100vh", overflow: "hidden" } }}
        >
            {children}
        </AppShell>
    );
};

const LayoutHeader: FC = () => {
    const { step, steps, selectedProperty, startTime, endTime, setStep } = useContext(BookingContext);

    const handleStepChange = (nextStep: number) => {
        if (nextStep >= 0 && nextStep < steps.length) setStep(nextStep);
    };

    const handleClick = (type: "next" | "previous") => () => {
        if (type === "next") {
            if (step < steps.length - 1 && steps[step].completed) setStep(step + 1);
        } else {
            if (step > 0) setStep(step - 1);
        }
    };

    return (
        <Header height={{ base: 128, xs: 64 }} withBorder={false}>
            <Stepper
                py={15}
                px={64}
                size="xs"
                active={step}
                breakpoint="sm"
                onStepClick={handleStepChange}
                display={{ base: "none", md: "block" }}
            >
                {steps.map((s, i) => (
                    <Stepper.Step
                        styles={{}}
                        key={i}
                        label={`Step ${i + 1}`}
                        icon={s.icon}
                        description={s.label}
                        completedIcon={s.completed ? <TbCheck /> : <TbX />}
                        color={step == i ? undefined : !steps[i].completed ? "red" : undefined}
                    />
                ))}
            </Stepper>
            <Flex
                px="xl"
                h="100%"
                align={{ xs: "center" }}
                justify={{ xs: "space-between" }}
                display={{ base: "flex", md: "none" }}
                direction={{ base: "column", xs: "row" }}
            >
                <Flex gap="md" sx={t => ({ [`@media(max-width: ${t.breakpoints.xs}px)`]: { flex: 1 } })} align="center">
                    <ThemeIcon size="xl" variant="light">
                        {steps[step].icon}
                    </ThemeIcon>
                    <Stack spacing={0}>
                        <Text size="sm" weight={500}>
                            Step {step + 1}
                        </Text>
                        <Text size="sm" color="dimmed">
                            {steps[step].label}
                        </Text>
                    </Stack>
                </Flex>
                <Group sx={t => ({ [`@media(max-width: ${t.breakpoints.xs}px)`]: { flex: 1 } })}>
                    <Button
                        style={{ flex: 1 }}
                        color="dark"
                        variant="filled"
                        disabled={step < 1}
                        leftIcon={<TbChevronLeft />}
                        onClick={handleClick("previous")}
                    >
                        Previous
                    </Button>
                    <Button
                        style={{ flex: 1 }}
                        color="dark"
                        variant="filled"
                        onClick={handleClick("next")}
                        rightIcon={<TbChevronRight />}
                        disabled={!steps[step].completed}
                    >
                        Next
                    </Button>
                </Group>
            </Flex>
        </Header>
    );
};
