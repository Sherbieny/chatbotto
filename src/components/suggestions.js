
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import Styles from './suggestions.module.css';
import Stack from '@mui/material/Stack';

export default function Suggestions({ suggestions, onSuggestionClick }) {
    if (!suggestions) return (<></>);
    return (
        <Stack spacing={2} className={Styles.suggestionContainer}>
            <List>
                {suggestions.map((suggestion, index) => (
                    <ListItem key={index} button onClick={() => onSuggestionClick(suggestion)}>
                        <ListItemIcon>
                            <PsychologyAltIcon className={Styles.questionIcon} />
                        </ListItemIcon>
                        <ListItemText primary={suggestion.prompt} />
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}