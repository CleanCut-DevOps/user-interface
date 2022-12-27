import { Container } from "@mantine/core";
import { FC } from "react";
import { DefaultLayout } from "../../components";

export const Dashboard: FC = () => {
    return (
        <DefaultLayout>
            <Container size={"xl"} mt={"xl"}>
                <div>Dashboard</div>
            </Container>
        </DefaultLayout>
    );
};
