import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Styles from './suggestions.module.css';

export default function InteractiveList() {
    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid container spacing={2} className={Styles.suggestionContainer}>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Suggestions
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <PsychologyAltIcon className={Styles.questionIcon} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Single-line item"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PsychologyAltIcon className={Styles.questionIcon} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Single-line item"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PsychologyAltIcon className={Styles.questionIcon} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Single-line item"
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Box>
    );
}