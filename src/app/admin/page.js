"use client";

import React, { useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TablePagination, Container, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
        // Example data
        { key: 'A-c', value: 1.0, label: 'Adjective-Common', labelJP: '形容詞' },
        // Add more weights
        { key: 'A-dp', value: 0.0, label: 'Adjective-Dependent', labelJP: '形容詞-非自立可能' },
    ]);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleWeightChange = (key, event) => {
        const updatedWeight = event.target.value;
        setWeightMap((prevWeightMap) =>
            prevWeightMap.map((weight) =>
                weight.key === key ? { ...weight, value: updatedWeight } : weight
            )
        );
    };

    // Function to handle file upload to the server
    const handleFileUpload = () => {
        // TODO: Implement file upload logic
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
                <Button component="label" variant="contained" onClick={handleFileUpload} startIcon={<CloudUploadIcon />}>
                    CSVのアップロード
                    <VisuallyHiddenInput type="file" accept='.csv' onChange={handleFileChange} />
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
