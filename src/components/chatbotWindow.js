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
    CircularProgress,
    Backdrop
} from '@mui/material';
import Suggestions from './suggestions';
import { useState, useEffect, useRef } from 'react';
import Tokenizer from '../../src/app/lib/tokenizer';


export default function ChatWindow() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([{ user: 'bot', text: 'こんにちは！本日はどのようにお手伝いできますか？' }]);
    const [tokenizer, setTokenizer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const lastMessageRef = useRef(null);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const getBestAnswer = async (message) => {
        if (!tokenizer) return;

        setIsLoading(true);
        const tokenizedInput = tokenizer.filterTokens(tokenizer.tokenize(message));
        let answer = 'その質問に対する答えはわかりません。';
        if (tokenizedInput.length > 0) {
            const response = await fetch('/api/qa?action=findBestMatch&query=' + encodeURIComponent(JSON.stringify(tokenizedInput)));
            const data = await response.json();
            answer = await tokenizer.findBestMatch(data, tokenizedInput)
        }

        setChatHistory(prevChatHistory => [...prevChatHistory, { user: 'user', text: message }, { user: 'bot', text: answer }]);
        setUserInput('');
        setIsLoading(false);
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
                setIsLoading(true);
                const tokenizedInput = tokenizer.filterTokens(tokenizer.tokenize(userInput));
                if (tokenizedInput.length === 0) return setSuggestions([]);

                const response = await fetch('/api/qa?action=getSuggestions&query=' + encodeURIComponent(JSON.stringify(tokenizedInput)));
                const data = await response.json();
                const filteredQA = await tokenizer.filterSuggestions(data, tokenizedInput)

                setSuggestions([...filteredQA]);
                setHasSuggestions(filteredQA.length > 0);
                setIsLoading(false);
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

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }

    }, [userInput, tokenizer, chatHistory]);

    return (
        <Container id='chatContainer' maxWidth="sm" className={styles.chatContainer}>
            <Stack className={`${styles.chatStack} ${hasSuggestions ? styles.suggestionsPoppedOut : ''}`}>
                {/* Chat panel */}
                <List className={styles.chatMessagesList}>
                    {chatHistory.map((message, index) => (
                        <ListItem key={index} ref={index === chatHistory.length - 1 ? lastMessageRef : null}>
                            <ListItemAvatar>
                                <Avatar>
                                    <Image src={message.user === 'bot' ? "/images/chatbot_icon_1.png" : "/images/user_icon2.png"} alt={message.user} width={40} height={40} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={message.text} />
                        </ListItem>
                    ))}
                </List>
                {/* Input field */}
                <Stack direction="row" spacing={0.5} className={styles.inputField}>
                    <TextField
                        className={styles.chatInput}
                        fullWidth
                        placeholder="メッセージを入力してください..."
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
                        送信
                    </Button>
                </Stack>
                {/* Suggestions panel */}
                <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestClick} />
            </Stack>
            <Backdrop open={isLoading} style={{ color: '#fff', zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}
