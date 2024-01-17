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
    Stack,
    CircularProgress
} from '@mui/material';
import Suggestions from './suggestions';
import { useState, useEffect } from 'react';
import Tokenizer from '../../src/app/lib/tokenizer';


export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([{ user: 'bot', text: 'Hello! How can I help you today?' }]);
    const [tokenizer, setTokenizer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        const chatPanel = document.querySelector('#chatContainer');
        chatPanel.classList.toggle('open');
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const getBestAnswer = async (message) => {
        if (!tokenizer) return;

        const tokenizedInput = tokenizer.filterTokens(tokenizer.tokenize(message));
        if (tokenizedInput.length === 0) return;

        const response = await fetch('/api/qa?action=findBestMatch&query=' + encodeURIComponent(JSON.stringify(tokenizedInput)));
        const data = await response.json();
        const answer = await tokenizer.findBestMatch(data, tokenizedInput)

        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'user', text: message }, { user: 'bot', text: answer }]);
        setUserInput('');
    };

    // Modify handleSendClick to call getBestAnswer with userInput
    const handleSendClick = () => {
        getBestAnswer(userInput);
    };

    // Modify handleSuggestClick to call sendMessage with the clicked suggestion
    const handleSuggestClick = (suggestion) => {
        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'user', text: suggestion.prompt }, { user: 'bot', text: suggestion.answer }]);
        setUserInput('');
    };

    useEffect(() => {
        if (userInput.length > 0) {
            const fetchSuggestions = async () => {
                if (!tokenizer) return;

                const tokenizedInput = tokenizer.filterTokens(tokenizer.tokenize(userInput));
                if (tokenizedInput.length === 0) return setSuggestions([]);

                const response = await fetch('/api/qa?action=getSuggestions&query=' + encodeURIComponent(JSON.stringify(tokenizedInput)));
                const data = await response.json();
                const filteredQA = await tokenizer.filterSuggestions(data, tokenizedInput)

                setSuggestions([...filteredQA]);
            };

            fetchSuggestions();
        }

        if (!tokenizer) {
            const initTokenizer = async () => {
                setIsLoading(true);
                const myTokenizer = new Tokenizer();
                await myTokenizer.init();
                setTokenizer(myTokenizer);
                setIsLoading(false);
            };

            initTokenizer();
        }

    }, [userInput, tokenizer]);

    return (
        <Box>
            <Button
                variant="contained"
                color="primary"
                className={styles.chatButton}
                onClick={toggleChat}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Chat with us'}
            </Button>
            <Container id='chatContainer' maxWidth="sm" className={isOpen ? `${styles.open} ${styles.chatContainer}` : styles.dnone}>
                <Stack className={styles.chatStack}>
                    {/* Chat panel */}
                    <List className={styles.chatMessagesList}>
                        {chatHistory.map((message, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Image src={message.user === 'bot' ? "/images/chatbot_icon_1.png" : "/images/user_icon2.png"} alt={message.user} width={40} height={40} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={message.text} />
                            </ListItem>
                        ))}
                    </List>
                    {/* Suggestions panel */}
                    <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestClick} />
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
                        <Button
                            variant="contained"
                            className={styles.sendButton}
                            onClick={handleSendClick}
                            disabled={isLoading}
                        >
                            Send
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
