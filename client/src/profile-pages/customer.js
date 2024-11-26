import React from 'react';
import { Container, Grid, Paper, Typography, Avatar, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';


const PaperStyled = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(10),
    height: theme.spacing(12),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export default function ProfilePage({ user }) {
    return (
        <Container>
            <PaperStyled>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <AvatarStyled>
                            <AccountCircleIcon fontSize="inherit" />
                        </AvatarStyled>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {user?.name || "User Name"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user?.email || "user@example.com"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonStyled variant="contained" color="primary">
                            Edit Profile
                        </ButtonStyled>
                    </Grid>
                </Grid>
            </PaperStyled>
        </Container>
    );
}
