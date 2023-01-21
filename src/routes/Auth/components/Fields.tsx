import { Box, Center, Checkbox, Group, PasswordInput, Progress, Text, TextInput } from "@mantine/core";
import { FC } from "react";
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
    stayP: { value: any; onChange: any; checked?: any; error?: any; onFocus?: any };
}

export const RegisterFields: FC<RegFieldProps> = ({ emailP, nameP, numberP, passwordP }) => {
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
            <div>
                <PasswordInput
                    withAsterisk
                    label="Password"
                    value={passwordP.value}
                    onFocus={passwordP.onFocus}
                    onChange={passwordP.onChange}
                    error={passwordP.error != null}
                    placeholder="Our little secret"
                />
                <Group mt="xs" mb="md" spacing="xs" grow>
                    {bars}
                </Group>
                <PasswordRequirement label="Has at least 8 characters" meets={passwordP.value.length >= 8} />
                {checks}
            </div>
        </>
    );
};

export const LoginFields: FC<LogFieldProps> = ({ credP, stayP, passwordP }) => {
    return (
        <>
            <TextInput withAsterisk label="Email" placeholder="your@email.com" {...credP} />
            <PasswordInput withAsterisk label="Password" placeholder="Our little secret" {...passwordP} />
            <Checkbox size={"sm"} label={"Remember me"} {...stayP} />
        </>
    );
};
