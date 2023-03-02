import { Grid } from "@mui/material";
import React from "react";

interface UserItemProps {
    userId: String
}

export const UserItem = ({userId}: UserItemProps): JSX.Element => {
    return <Grid>
        {userId}
    </Grid>
}

