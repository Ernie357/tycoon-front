import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import UserBox from "../../components/UserBox";
import { GameState, CardType, User, Message } from "./types";
import getRelevantCard from "./gameHelpers/getRelevantCard";
import PlayController from "../../components/PlayController";
import TradeController from "../../components/TradeController";
import getTradeName from "./gameHelpers/getTradeName";
import ChatBox from "../../components/ChatBox";
import EventLog from "../../components/EventLog";
import DialogueBox from "../../components/DialogueBox";

const Game: React.FC = () => {
    const defaultGameState: GameState = {
        activeCards: [],
        roundNumber: 0,
        users: [],
        turnPlayer: '',
        passCount: 0,
        activeUsers: [],
        revolution: false,
        betweenRounds: false,
        numTradesMade: 0,
        tycoonLost: false,
        gameIsActive: false,
        host: '',
        messages: [],
        roomCode: ''
    };
    const navigate = useNavigate();
    const location = useLocation();
    const { playerName, playerImage } = location.state;
    const { id } = useParams();
    const [gameState, setGameState] = useState<GameState>(defaultGameState);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
    const [chatOpen, setChatOpen] = useState<boolean>(true);
    const [logOpen, setLogOpen] = useState<boolean>(true);
    const handleOpenOrClose = (event: any) => {
        if(event.target.name === 'chat') {
            setChatOpen(prev => !prev);
        } else {
            setLogOpen(prev => !prev);
        }
    }
    const startGame = () => {
        gameState.users.length === 4 && socket?.emit('start game', id);
    }
    const playCards = () => {
        if(selectedCards.length === 0) {
            console.log('cant play it, no card selected!');
            return;
        }
        if(activeCards.length > 0 && selectedCards.length !== gameState.activeCards.length) {
            console.log('cant play it, card amount not equal!');
            return;
        }
        if(selectedCards.length === 4) {
            console.log('revolution!');
            socket?.emit('revolution', id);
            socket?.emit('play cards', id, selectedCards, playerName);
            setSelectedCards([]);
            return;
        }
        const relevantSelectedCard = getRelevantCard(selectedCards);
        const relevantActiveCard = getRelevantCard(gameState.activeCards);
        if(relevantSelectedCard.faceValue === 'Joker' && relevantActiveCard.faceValue !== 'Joker') {
            socket?.emit('play cards', id, selectedCards, playerName);
            setSelectedCards([]);
            return; 
        }
        if(relevantSelectedCard.faceValue === '3' && relevantSelectedCard.suit === 'Spades' && relevantActiveCard.faceValue === 'Joker') {
            socket?.emit('play cards', id, selectedCards, playerName);
            socket?.emit('reset turn', id, playerName);
            setSelectedCards([]);
            return;
        }
        if(gameState.revolution && gameState.activeCards.length > 0 && +relevantSelectedCard.numberValue >= +relevantActiveCard.numberValue) {
            console.log('cant play it, not good enough because of revolution');
            return;
        }
        if(!gameState.revolution && gameState.activeCards.length > 0 && +relevantSelectedCard.numberValue <= +relevantActiveCard.numberValue) {
            if(relevantActiveCard.faceValue !== '8') {
                console.log('cant play it, not good enough!');
                return;
            }
        }
        socket?.emit('play cards', id, selectedCards, playerName);
        if(relevantSelectedCard.faceValue === '8') {
            socket?.emit('reset turn', id, playerName);
        } 
        setSelectedCards([]);
    }
    const passTurn = () => {
        socket?.emit('pass turn', id, playerName);
    }
    const tradeCards = (rank: string) => {
        socket?.emit('trade cards', id, playerName, getTradeName(rank, gameState.users), selectedCards);
        setSelectedCards([]);
    }
    useEffect(() => {
        if(gameState.passCount >= gameState.activeUsers.length - 1 && gameState.passCount !== 0 && playerName === gameState.host) {
            socket?.emit('reset turn', id, gameState.turnPlayer);
        }
    }, [gameState.passCount]);
    useEffect(() => {
        if(gameState.activeUsers.length === 1 && gameState.roundNumber < 4) {
            socket?.emit('between round start', id);
        }
    }, [gameState.activeUsers.length]);
    useEffect(() => {
        if(gameState.numTradesMade === 4 && gameState.roundNumber < 4) {
            socket?.emit('start new round', id);
        }
    }, [gameState.numTradesMade]);
    useEffect(() => {
        if(gameState.roundNumber === 4) {
            socket?.emit('end game', id);
        }
    }, [gameState.roundNumber]);
    useEffect(() => {
        const newSocket: Socket = io('https://tycoon-back.onrender.com');
        setSocket(newSocket);
        newSocket.on('connect', () => {
            newSocket.emit('join', id, playerName, playerImage);
        });
        newSocket.on('update game state', (newState: GameState) => {
            setGameState(newState);
        });
        newSocket.on('room join error', (reasonForError: string) => {
            alert(reasonForError);
            navigate('/');
        });
        const handleCleanup = () => {
            newSocket.emit('leave', id);
            newSocket.disconnect();
        };
        window.addEventListener('beforeunload', handleCleanup);
        return () => {
            window.removeEventListener('beforeunload', handleCleanup);
            handleCleanup();
        };
    }, [id, playerName, playerImage]);
    const user: User = gameState.users.reduce((acc: any, cur: User) => {
        return cur.name === playerName ? cur : acc;
    }, null);
    const playerCards = gameState.betweenRounds ?                     
            <TradeController 
                user={user}
                tradeCards={tradeCards}
                selectedCards={selectedCards} 
                setSelectedCards={setSelectedCards} 
                turnPlayer={gameState.turnPlayer}
                betweenRounds={gameState.betweenRounds}
            />
            :
            <div>
                <PlayController 
                    user={user}
                    playCards={playCards}
                    passTurn={passTurn}
                    selectedCards={selectedCards} 
                    setSelectedCards={setSelectedCards} 
                    turnPlayer={gameState.turnPlayer}
                    betweenRounds={gameState.betweenRounds}
                />
            </div>;
    const userBoxes = gameState.users.map(user => <UserBox user={user} host={gameState.host} key={user.name} />);
    const activeCards = gameState.activeCards.map(card => {
        return <img src={`/images/${card.image}`} alt={`${card.faceValue} of ${card.suit}`} className="max-w-16 md:max-w-24" />
    });
    const cardsFromTrade = user ? user.cardsFromTrade.map(card => {
        return <img src={`/images/${card.image}`} alt={`${card.faceValue} of ${card.suit}`} className="max-w-16 md:max-w-24" />
    }) : <></>;
    const chatMessages = gameState.messages.filter((message: Message) => {
        return message.sender !== null;
    });
    const logMessages = gameState.messages.filter((message: Message) => {
        return message.sender === null;
    });
    return (
        <div className="bg-persona-red w-screen min-h-screen pb-12 font-main">
            <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-4 md:grid-rows-2 2xl:flex gap-y-12 xl:gap-12 justify-items-center p-5 xl:p-12 border-b-2 border-black shadow-2xl shadow-black shadow-bottom">
                { userBoxes }
                <div className="flex flex-col items-center flex-grow col-span-2 md:col-span-4 w-full">
                    <EventLog 
                        messages={logMessages} 
                        logOpen={logOpen} 
                        roundNumber={gameState.roundNumber}
                        turnPlayer={gameState.turnPlayer} 
                        gameIsActive={gameState.gameIsActive}
                        roomCode={gameState.roomCode}
                    />
                    {/*<button onClick={handleOpenOrClose} className="mt-3 bg-white p-2 border-2 border-black shadow shadow-black hover:bg-gray-200" name='log'>{logOpen ? 'Close' : 'Open'} Game Log</button>*/}
                </div>
            </div>
            <br></br>
            <br></br>
            { gameState.gameIsActive && <div className="flex flex-col lg:flex-row align-center w-full lg:gap-16 mb-36 lg:mb-0 h-500">
                {user.cards.length > 0 && <div className="w-full lg:w-7/12 ml-0 lg:ml-12 bg-white border-2 shadow-2xl shadow-black border-black h-full ">
                    { playerCards }
                </div>}
                <div className="flex flex-col items-center pt-5 pb-5 h-full w-full lg:w-32-p border-2 border-black shadow-2xl shadow-black bg-white">
                    <h2 className="sm:text-2xl lg:text-4xl"><b>{`${gameState.betweenRounds ? 'Cards From Trade: ' : 'Active Cards: '}`}</b></h2>
                    <br></br>
                    <div className={`${activeCards.length > 3 ? 'flex lg:grid grid-cols-2 grid-rows-2 gap-5' : 'flex gap-5'}`}>
                        {gameState.betweenRounds ? cardsFromTrade : activeCards}
                    </div>
                </div>
            </div>}
            <div className="flex h-96 p-12 flex-col lg:flex-row">
                <div className="flex flex-col items-center w-full 2xl:w-auto">
                    <ChatBox 
                        user={user} 
                        socket={socket} 
                        messages={chatMessages} 
                        roomCode={id} 
                        chatOpen={chatOpen}
                    />
                    {/*<button onClick={handleOpenOrClose} className="mt-3 bg-white p-2 border-2 border-black shadow shadow-black hover:bg-gray-200" name='chat'>{chatOpen ? 'Close' : 'Open'} Game Chat</button>*/}
                </div>
                { chatMessages.length > 0 && <DialogueBox message={chatMessages[chatMessages.length - 1]} /> }
            </div>
            <div className="flex gap-5 pl-12">
                { !gameState.gameIsActive && gameState.users.length === 4 && playerName === gameState.host && <button onClick={startGame} className="bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200">Start Game</button> }
                <Link to='/' className="bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200">Leave Room</Link>
            </div>
        </div>
    );
}

export default Game;