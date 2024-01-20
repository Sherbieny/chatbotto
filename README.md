# チャットボット

## 説明

このプロジェクトは、Nextjs と Nodejs で構築されたルールベースのチャットボットアプリケーションです。日本語の形態素解析に[RakutenMA](https://github.com/rakuten-nlp/rakutenma)ライブラリを使用し、ユーザーとの対話のためのチャットインターフェースを提供します。アプリケーションには、ユーザーの入力の各単語の重要性を決定するために使用される`Weights`データを管理するための管理ページも含まれています。

## インストール

1. リポジトリをクローンします。
   ```bash
   git clone <repository-url>
   ```
2. 依存関係をインストールします。
   ```bash
    npm install
   ```
3. `.env.local.tmp`を`.env.local`に名前を変更し、環境変数を入力します。

4. ローカルで MongoDB のデータベースを作成するか、MongoDB Atlas などのクラウドデータベースサービスを使用します。
   1. `chatbotto`という名前のデータベースと`weights`という名前のコレクションを作成します。
   2. `qa`という名前のコレクションを作成します。
   3. [オプション] `sample_data`の json ファイルを使用して、サンプルデータでデータベースを作成します。

## アプリケーションの実行

開発モードでアプリケーションを実行するには、次のコマンドを使用します。

```bash
npm run dev
```

本番モードでアプリケーションをビルドして実行するには、次のコマンドを使用します。

```bash
npm run build
npm start
```

## Docker

このプロジェクトには、Docker コンテナでアプリケーションを実行するための Dockerfile と docker-compose.yml ファイルが含まれています。Docker コンテナをビルドして実行するには、次のコマンドを使用します。

```bash
docker-compose build
docker-compose up
```

## 機能

- ユーザーとの対話のためのチャットインターフェース
- RakutenMA ライブラリを使用した形態素解析
- アプリケーションを管理するための管理ページ
- ユーザーの入力の各単語の重要性を決定するための重みデータ
- qa データは[JaQuAD](https://huggingface.co/SkelterLabsInc/bert-base-japanese-jaquad)データセットに基づいています

## ツールとテクノロジー

- [Nextjs](https://nextjs.org/)
- [Nodejs](https://nodejs.org/en/)
- [RakutenMA](https://github.com/rakuten-nlp/rakutenma)
- [MongoDB](https://www.mongodb.com/)
- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Material UI](https://material-ui.com/)
- [React](https://reactjs.org/)
- [Github Copilot](https://copilot.github.com/)
- [Github Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

## 貢献

貢献は歓迎します。プルリクエストを送信するか、変更内容を議論するための問題を作成してください。

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

## Tools and Technologies

- [Nextjs](https://nextjs.org/)
- [Nodejs](https://nodejs.org/en/)
- [RakutenMA](https://github.com/rakuten-nlp/rakutenma)
- [MongoDB](https://www.mongodb.com/)
- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Material UI](https://material-ui.com/)
- [React](https://reactjs.org/)
- [Github Copilot](https://copilot.github.com/)
- [Github Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to discuss the changes you want to make.
