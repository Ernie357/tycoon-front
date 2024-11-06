import { useEffect, useRef } from "react";
import { Message } from "../pages/Game/types";

interface Props {
    messages: Message[],
    logOpen: boolean,
    roundNumber: number,
    turnPlayer: string,
    gameIsActive: boolean,
    roomCode: string
}

const EventLog: React.FC<Props> = (props: Props) => {
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const messageElements = props.messages.map((message: Message, idx: number) => {
        return !message.sender ? <p key={idx} className={`text-xs md:text-base text-red-500 p-2 ${idx < props.messages.length - 1 ? 'border-black border-b-2' : ''}`}>[SYSTEM]: {message.content}</p> : <></>;
    });
    useEffect(() => {
        if (messageContainerRef.current && messageContainerRef.current.scrollTop !== messageContainerRef.current.scrollHeight) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [props.messages]);
    return (
        <div className="bg-white shadow shadow-black h-0 flex flex-col flex-grow h-0 border-black border-2 w-full" style={{ visibility: props.logOpen ? 'visible' : 'hidden' }}>
            <div className={`grid grid-rows-2 grid-cols-2 md:flex justify-between border-b-2 border-black p-2`}>
                <p className="text-xs md:text-base"><b>Room Code: </b> {props.roomCode}</p>
                { props.roundNumber > 0 && props.roundNumber < 4 && <p className="text-xs md:text-base justify-self-end md:justify-self-auto"><b>Round: </b>{props.roundNumber}</p> } 
                { props.turnPlayer && <p className="text-xs md:text-base"><b>It is {props.turnPlayer}'s turn</b></p> }
            </div>
            <div ref={messageContainerRef} className="flex flex-col flex-grow overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {messageElements}
            </div>
        </div>
    );
}

export default EventLog;