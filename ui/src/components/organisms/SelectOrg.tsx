import { FC } from 'react';
import {
    Box,
    Container,
    Divider,
    List,
    ListItem,
    MenuItem,
    MenuList,
    Paper,
    Typography,
} from '@mui/material';
import { SelectOrgProps } from '../../dynamicPages/select-org';

const SelectOrg: FC<SelectOrgProps> = (props: SelectOrgProps) => {
    return (
        <Box my={4}>
            <Container maxWidth="sm">
                <Paper elevation={5}>
                    <List>
                        <ListItem>
                            <Typography variant="h5" component="h2">
                                Select Organization
                            </Typography>
                        </ListItem>
                    </List>
                    <Divider />
                    <MenuList id="menu-list-grow">
                        {props.orgs.map((_) => (
                            <MenuItem key={_.id} onClick={_.action}>
                                {_.org}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Container>
        </Box>
    );
};

export { SelectOrg };
