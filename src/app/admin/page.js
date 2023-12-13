"use client";

import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, Container, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Refresh } from '@mui/icons-material';

export default function AdminPage() {

    // Pagination

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [file, setFile] = useState(null);
    const [weightMap, setWeightMap] = useState([
        { key: 'A-c', value: 0, label: 'Adjective-Common', labelJP: '形容詞' },
        { key: 'A-dp', value: 0, label: 'Adjective-Dependent', labelJP: '形容詞-非自立可能' },
        { key: 'C', value: 0, label: 'Conjunction', labelJP: '接続詞' },
        { key: 'D', value: 0, label: 'Pronoun', labelJP: '代名詞' },
        { key: 'E', value: 2, label: 'English word', labelJP: '英単語' },
        { key: 'F', value: 0, label: 'Adverb', labelJP: '副詞' },
        { key: 'I-c', value: 0, label: 'Interjection-Common', labelJP: '感動詞-一般' },
        { key: 'J-c', value: 0, label: 'Adjectival Noun-Common', labelJP: '形状詞-一般' },
        { key: 'J-tari', value: 0, label: 'Adjectival Noun-Tari', labelJP: '形状詞-タリ' },
        { key: 'J-xs', value: 0, label: 'Adjectival Noun-AuxVerb stem', labelJP: '形状詞-助動詞語幹' },
        { key: 'M-aa', value: 0, label: 'Auxiliary sign-AA', labelJP: '補助記号-AA' },
        { key: 'M-c', value: 0, label: 'Auxiliary sign-Common', labelJP: '補助記号-一般' },
        { key: 'M-cp', value: 0, label: 'Auxiliary sign-Open Parenthesis', labelJP: '補助記号-括弧閉' },
        { key: 'M-op', value: 0, label: 'Auxiliary sign-Close Parenthesis', labelJP: '補助記号-括弧開' },
        { key: 'M-p', value: 0, label: 'Auxiliary sign-Period', labelJP: '補助記号-句点' },
        { key: 'N-n', value: 3, label: 'Noun-Noun', labelJP: '名詞-名詞的' },
        { key: 'N-nc', value: 3, label: 'Noun-Common Noun', labelJP: '名詞-普通名詞' },
        { key: 'N-pn', value: 3, label: 'Noun-Proper Noun', labelJP: '名詞-固有名詞' },
        { key: 'N-xs', value: 0, label: 'Noun-AuxVerb stem', labelJP: '名詞-助動詞語幹' },
        { key: 'O', value: 0, label: 'Others', labelJP: 'その他' },
        { key: 'P', value: 0, label: 'Prefix', labelJP: '接頭辞' },
        { key: 'P-fj', value: 0, label: 'Particle-Adverbial', labelJP: '助詞-副助詞' },
        { key: 'P-jj', value: 0, label: 'Particle-Phrasal', labelJP: '助詞-準体助詞' },
        { key: 'P-k', value: 0, label: 'Particle-Case Marking', labelJP: '助詞-格助詞' },
        { key: 'P-rj', value: 0, label: 'Particle-Binding', labelJP: '助詞-係助詞' },
        { key: 'P-sj', value: 0, label: 'Particle-Conjunctive', labelJP: '助詞-接続助詞' },
        { key: 'Q-a', value: 0, label: 'Suffix-Adjective', labelJP: '接尾辞-形容詞的' },
        { key: 'Q-j', value: 0, label: 'Suffix-Adjectival Noun', labelJP: '接尾辞-形状詞的' },
        { key: 'Q-n', value: 0, label: 'Suffix-Noun', labelJP: '接尾辞-名詞的' },
        { key: 'Q-v', value: 0, label: 'Suffix-Verb', labelJP: '接尾辞-動詞的' },
        { key: 'R', value: 0, label: 'Adnominal adjective', labelJP: '連体詞' },
        { key: 'S-c', value: 0, label: 'Sign-Common', labelJP: '記号-一般' },
        { key: 'S-l', value: 0, label: 'Sign-Letter', labelJP: '記号-文字' },
        { key: 'U', value: 0, label: 'URL', labelJP: 'URL' },
        { key: 'V-c', value: 2, label: 'Verb-Common', labelJP: '動詞-一般' },
        { key: 'V-dp', value: 0, label: 'Verb-Dependent', labelJP: '動詞-非自立可能' },
        { key: 'W', value: 0, label: 'Whitespace', labelJP: '空白' },
        { key: 'X', value: 0, label: 'AuxVerb', labelJP: '助動詞' }
    ]);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            //TODO: Implement file upload logic
            // Read the file content
            // covert json file content to qa data
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                processJsonFile(fileContent);
            }

            reader.readAsText(uploadedFile);
        };
    };

    const processJsonFile = (fileContent) => {
        const jsonData = JSON.parse(fileContent);
        const qaData = [];

        // Process the json data
        jsonData.data.forEach((item) => {
            item.paragraphs.forEach((paragraph) => {
                paragraph.qas.forEach((qa) => {
                    qaData.push({
                        prompt: qa.question,
                        answer: qa.answers[0].text,
                    });
                });
            });
        });

        downloadProcessedData(qaData);
    };

    const downloadProcessedData = (qaData) => {
        const fileName = 'qa_data.json';
        const json = JSON.stringify(qaData);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleWeightChange = (key, event) => {
        const updatedWeight = event.target.value;
        setWeightMap((prevWeightMap) =>
            prevWeightMap.map((weight) =>
                weight.key === key ? { ...weight, value: updatedWeight } : weight
            )
        );
    };

    const handleRefreshClick = async () => {
        try {
            const response = await fetch('/api/weights?action=getTokenWeights');
            const data = await response.json();
            setWeightMap(data);
        } catch (err) {
            console.log(err);
        }
    };


    // Function to handle weight map save to the server
    const handleSaveWeights = () => {
        // TODO: Implement save weights logic
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h1" gutterBottom>
                    管理
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    JSONのアップロード
                    <VisuallyHiddenInput type="file" accept='.json' onChange={handleFileChange} />
                </Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Button component="label" variant="contained" onClick={handleRefreshClick} startIcon={<Refresh />}>
                    リフレッシュする
                </Button>
            </Box>


            <Divider sx={{ mt: 2, mb: 2 }}></Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Typography sx={{ width: '100%', textAlign: 'center', mb: 2 }} variant="h6" gutterBottom>
                    日本語品詞リストと対応する BCCWJ の品詞名
                </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} elevation={3}>
                    {/* Weight Map Table */}
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>ラベル (EN)</TableCell>
                                    <TableCell>ラベル (JP)</TableCell>
                                    <TableCell>重味</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weightMap.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((weight) => (
                                    <TableRow key={weight.key}>
                                        <TableCell>{weight.key}</TableCell>
                                        <TableCell>{weight.label}</TableCell>
                                        <TableCell>{weight.labelJP}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={weight.value}
                                                onChange={(event) => handleWeightChange(weight.key, event)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={weightMap.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleSaveWeights}>
                        Save Weights
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
