import { useEffect, useRef } from "react";
import { GameState, Message } from "../pages/Game/types";
import { Link } from "react-router-dom";

interface Props {
    gameState: GameState,
    startGame: () => void,
    playerName: string
}   

const EventLog: React.FC<Props> = (props: Props) => {
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const messageElements = props.gameState.messages.map((message: Message, idx: number) => {
        return !message.sender ? <p key={idx} className={`text-xs md:text-base text-red-500 p-2 ${idx < props.gameState.messages.length - 1 ? 'border-black border-b-2' : ''}`}>[SYSTEM]: {message.content}</p> : <></>;
    });
    useEffect(() => {
        if (messageContainerRef.current && messageContainerRef.current.scrollTop !== messageContainerRef.current.scrollHeight) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [props.gameState.messages]);
    return (
        <div className="bg-white shadow shadow-black flex flex-col flex-grow max-h-44 lg:max-h-80 border-black border-2 w-full">
            <div className={`grid grid-rows-2 grid-cols-2 md:flex justify-between border-b-2 border-black p-2`}>
                <p className="text-xs md:text-base"><b>Room Code: </b> {props.gameState.roomCode}</p>
                { props.gameState.roundNumber > 0 && props.gameState.roundNumber < 4 && <p className="text-xs md:text-base justify-self-end md:justify-self-auto"><b>Round: </b>{props.gameState.roundNumber}</p> } 
                { props.gameState.turnPlayer && <p className="text-xs md:text-base"><b>It is {props.gameState.turnPlayer}'s turn</b></p> }
            </div>
            <div ref={messageContainerRef} className="flex flex-col flex-grow overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {messageElements}
            </div>
            <div className="flex gap-5 border-t-2 border-black p-2">
                <Link to='/' className="text-xs lg:text-base lg:w-44 bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200 text-center">Leave Room</Link>
                { !props.gameState.gameIsActive && props.gameState.users.length === 4 && props.playerName === props.gameState.host && <button onClick={props.startGame} className="text-xs lg:text-base lg:w-44 bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200 text-center">Start Game</button> }
            </div>
        </div>
    );
}

export default EventLog;