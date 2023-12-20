"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, Container, Divider, Typography, Snackbar, Alert } from '@mui/material';
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

    // Weight Map
    const [weightMap, setWeightMap] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/weights?action=getTokenWeights');
                const data = await response.json();
                setWeightMap(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

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


    // Function to handle weight map save to the db
    const handleSaveWeights = () => {
        const saveWeights = async () => {
            try {
                const response = await fetch('/api/weights?action=updateTokenWeights', {
                    method: 'POST',
                    body: JSON.stringify(weightMap),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const jsonResponse = await response.json();
                console.log(jsonResponse);

                if (jsonResponse.success) {
                    setSeverity('success');
                    setMessage('Weights saved successfully');
                    setOpen(true);
                } else {
                    setSeverity('error');
                    setMessage('Error saving weights');
                    setOpen(true);
                }

            } catch (err) {
                console.log(err);
            }
        };
        saveWeights();
    };

    // Snackbar
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // TEMP file upload logic
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
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

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
