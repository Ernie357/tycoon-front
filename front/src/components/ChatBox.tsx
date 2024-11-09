import { ChangeEvent, useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Message } from "../pages/Game/types";

interface CardType {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

interface User {
    name: string,
    image: string,
    cards: CardType[],
    points: number,
    rank: string
}

interface Props {
    user: User,
    socket: Socket | null,
    messages: Message[],
    roomCode: string | undefined
}

const ChatBox: React.FC<Props> = (props: Props) => {
    const [message, setMessage] = useState<string>('');
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }
    const handleMessageSend = () => {
        if(message === '') {
            return;
        }
        props.socket?.emit('send chat message', props.roomCode, props.user, message);
        setMessage('');
    }
    const messageElements = props.messages.map((message: Message, idx: number) => {
        return message.sender ? <p key={idx} className={`p-2 ${idx < props.messages.length - 1 ? 'border-black border-b-2' : ''}`}><b>{message.sender && message.sender.name && `${message.sender.name}: `}</b>{message.content}</p> : <></>;
    });
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [props.messages]);
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleMessageSend();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [message]);
    return (
        <div className="bg-white shadow shadow-black border-2 border-black p-3 flex flex-col 2xl:w-96 h-full lg:h-full w-full">
            <div ref={messageContainerRef} className="flex flex-col flex-grow h-0 overflow-y-scroll border-black border-2 p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {messageElements}
            </div>
            <div className="flex items-center mt-3">
                <input 
                    className="border-black border-2 p-2 mr-2 sm:mr-5"
                    type="text"
                    onChange={handleMessageChange}
                    value={message}
                    placeholder="Enter chat..."
                />
                <button onClick={handleMessageSend} className="text-sm sm:text-lg font-main"><b>Send</b></button>
            </div>
        </div>
    );
}

export default ChatBox;