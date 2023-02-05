import { Accordion, Box, Center, Checkbox, Group, PasswordInput, Progress, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { FC, useState } from "react";
import { TbCheck, TbX } from "react-icons/tb";

interface RegFieldProps {
    nameP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
    numberP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
    emailP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
    passwordP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
}

interface LogFieldProps {
    credP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
    passwordP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
    rememberP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
}

export const RegisterFields: FC<RegFieldProps> = ({ emailP, nameP, numberP, passwordP }) => {
    const [value, setValue] = useState("");
    const [opened, { open, close }] = useDisclosure(false);

    const requirements = [
        { re: /[0-9]/, label: "Includes number" },
        { re: /[a-z]/, label: "Includes lowercase letter" },
        { re: /[A-Z]/, label: "Includes uppercase letter" }
    ];

    const PasswordRequirement: FC<{ meets: boolean; label: string }> = ({ meets, label }) => {
        return (
            <Text mt={2} size="xs" color={meets ? "teal" : "red"}>
                <Center inline>
                    {meets ? <TbCheck /> : <TbX />}
                    <Box ml={8}>{label}</Box>
                </Center>
            </Text>
        );
    };

    const getStrength = (password: string) => {
        let multiplier = password.length >= 8 ? 0 : 1;

        requirements.forEach(requirement => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });

        return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
    };

    const strength = getStrength(passwordP.value);

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(passwordP.value)} />
    ));

    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                size={4}
                key={index}
                color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
                styles={{ bar: { transitionDuration: "200ms", transitionTimingFunction: "ease" } }}
                value={passwordP.value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0}
            />
        ));

    return (
        <>
            <TextInput withAsterisk label="Full name" placeholder="John Doe" {...nameP} />
            <TextInput withAsterisk label="Contact number" placeholder="+65 88884444" {...numberP} />
            <TextInput withAsterisk label="Email" placeholder="your@email.com" {...emailP} />
            <Accordion
                variant="default"
                value={value}
                styles={{
                    item: { backgroundColor: "inherit", border: 0 },
                    content: { padding: 0, paddingTop: 8 }
                }}
            >
                <Accordion.Item value="password">
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        value={passwordP.value}
                        onFocus={() => {
                            setValue("password");
                            passwordP.onFocus();
                        }}
                        onBlur={() => setValue("")}
                        onChange={passwordP.onChange}
                        error={passwordP.error != null}
                        placeholder="Our little secret"
                    />
                    <Accordion.Panel>
                        <Group mt="xs" mb={8} spacing="xs" grow>
                            {bars}
                        </Group>
                        <PasswordRequirement label="Has at least 8 characters" meets={passwordP.value.length >= 8} />
                        {checks}
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export const LoginFields: FC<LogFieldProps> = ({ credP, rememberP, passwordP }) => {
    return (
        <>
            <TextInput withAsterisk label="Email" placeholder="your@email.com" {...credP} />
            <PasswordInput withAsterisk label="Password" placeholder="Our little secret" {...passwordP} />
            <Checkbox size={"sm"} label={"Remember me"} {...rememberP} />
        </>
    );
};
