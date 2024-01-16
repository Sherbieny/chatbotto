import styles from './page.module.css'; // Ensure you have this CSS file in the right place
import Link from 'next/link';
import Image from 'next/image';
import ChatWindow from '@/components/chatbotWindow';
import Script from 'next/script';

export default function Home() {
    return (
        <main className={styles.main}>
            <Script src="/rakutenma/rakutenma.js" />
            <Script src="/rakutenma/model_ja.min.json" />
            <Script src="/rakutenma/hanzenkaku.js" />
            <Script src="/rakutenma/model_ja.js" />
            <Image src="/images/chatbot_icon_1.png" alt="Chatbot" width={200} height={200} />
            <h1>チャットボット!</h1>
            <p>Click the button below to chat with our bot.</p>
            <ChatWindow />
            <Link href="/admin" className={styles.adminButton}>
                <Image src="/images/admin_icon_1.png" alt="Chatbot" width={40} height={40} />
            </Link>
        </main>
    );
}
