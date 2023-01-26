import { FC } from "react";

import { Loading } from "~/components";

type ComponentProps = { params: { id: string } };

export const ViewProperty: FC<ComponentProps> = ({ params: { id } }) => {
    console.log(id);

    return <Loading />;
};
