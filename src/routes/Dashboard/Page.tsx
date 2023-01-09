import { Container } from "@mantine/core";
import { FC } from "react";
import { AuthWrapper, DefaultLayout } from "../../components";

export const Dashboard: FC = () => {
    return (
        <AuthWrapper requireAuth>
            <DefaultLayout>
                <Container size={"xl"} mt={"xl"}>
                    <div>Dashboard</div>
                </Container>
            </DefaultLayout>
        </AuthWrapper>
    );
};
