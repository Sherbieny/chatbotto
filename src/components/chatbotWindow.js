"use client";

import styles from './chatbot.module.css';
import Image from 'next/image';
import {
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
    Button,
    Container,
    Stack
} from '@mui/material';
import Suggestions from './suggestions';
import { useState, useEffect } from 'react';


export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        const chatPanel = document.querySelector('#chatContainer');
        chatPanel.classList.toggle('open');
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendClick = async () => {
        const response = await fetch('/api/qa?action=findBestMatch&query=' + encodeURIComponent(userInput));
        const data = await response.json();

        setChatHistory([...chatHistory, { user: 'bot', text: data }]);
        setUserInput('');
    };

    useEffect(() => {
        if (userInput.length > 0) {
            const fetchSuggestions = async () => {
                const response = await fetch('/api/qa?action=getSuggestions&query=' + encodeURIComponent(userInput));
                const data = await response.json();

                // Do something with the suggestions
            };

            fetchSuggestions();
        }
    }, [userInput]);

    return (
        <Box>
            <Button
                variant="contained"
                color="primary"
                className={styles.chatButton}
                onClick={toggleChat}
            >
                Chat with us
            </Button>
            <Container id='chatContainer' maxWidth="sm" className={isOpen ? `${styles.open} ${styles.chatContainer}` : styles.dnone}>
                <Stack className={styles.chatStack}>
                    {/* Chat panel */}
                    <List className={styles.chatMessagesList}>
                        {/* Example message from the chatbot */}
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Image src="/images/chatbot_icon_1.png" alt="Chatbot" width={40} height={40} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Hello! How can I help you today?" />
                        </ListItem>
                        {/* Add more <ListItem> components for additional messages */}
                    </List>
                    {/* Suggestions panel */}
                    <Suggestions />
                    {/* Input field */}
                    <Stack direction="row" spacing={0.5}>
                        <TextField
                            className={styles.chatInput}
                            fullWidth
                            placeholder="Type your message..."
                            variant="outlined"
                            InputProps={{ // Add this prop to style the input text color
                                className: styles.chatInput
                            }}
                            value={userInput}
                            onChange={handleInputChange}
                        />
                        <Button variant="contained" className={styles.sendButton} onClick={handleSendClick}>
                            Send
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
