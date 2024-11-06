import { CardType, User } from "../pages/Game/types"
import CardList from "./CardList";

interface Props {
    turnPlayer: string,
    selectedCards: CardType[],
    setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>,
    playCards: () => void,
    passTurn: () => void,
    betweenRounds: boolean,
    user: User
}

const PlayController: React.FC<Props> = (props: Props) => {
    return (
        <div className="flex flex-col items-center pt-5 pb-5 h-full">
            <h1 className="text-sm md:text-xl text-center"><b>Select valid cards then click "Play" to play them. Click "pass" to pass your turn.</b></h1>
            <CardList 
                cards={props.user.cards} 
                selectedCards={props.selectedCards} 
                setSelectedCards={props.setSelectedCards} 
                turnPlayer={props.turnPlayer} 
                playerName={props.user.name}
                cardsAreSelectable={true}
                betweenRounds={props.betweenRounds}
                user={props.user}
            />
            <div className="flex justify-center gap-20 md:p-5">
                {props.user.cards.length > 0 && props.turnPlayer === props.user.name &&
                    <button onClick={props.playCards} className="text-xs lg:text-base w-16 md:w-32 bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200">Play</button>
                }
                {props.user.cards.length > 0 && props.turnPlayer === props.user.name &&
                    <button onClick={props.passTurn} className="text-xs lg:text-base w-16 md:w-32 bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200">Pass</button>
                }
            </div>
        </div>
    );
}

export default PlayController;