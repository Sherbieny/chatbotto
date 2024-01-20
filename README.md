# Chatbotto

## Description

This project is a rule-based chatbot application built with Nextjs, and Nodejs. It uses the [RakutenMA](https://github.com/rakuten-nlp/rakutenma) library for morphological analysis of Japanese language and provides a chat interface for user interaction. The application also includes an admin page for managing the application's `Weights` data that is used to determine the importance of each word in the user's input.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.local.tmp` to `.env.local` and fill in your environment variables.

4. Create a database locally in MongoDB or use a cloud database service such as MongoDB Atlas.
   1. Create a database named `chatbotto` and a collection named `weights`.
   2. Create a collection named `qa`
   3. [Optional] use the json files in `sample_data` to populate the database with sample data.

## Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

To build and run the application in production mode, use the following commands:

```bash
npm run build
npm start
```

## Docker

This project includes a Dockerfile and a docker-compose.yml file for running the application in a Docker container. To build and run the Docker container, use the following commands:

```bash
docker-compose build
docker-compose up
```

## Features

- Chat interface for user interaction
- Morphological analysis using the RakutenMA library
- Admin page for managing the application
- Weights data for determining the importance of each word in the user's input
- qa data is based on [JaQuAD](https://huggingface.co/SkelterLabsInc/bert-base-japanese-jaquad) dataset

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.
