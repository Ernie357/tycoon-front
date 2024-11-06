import React from "react";
import { CardType, User } from "../pages/Game/types"
import CardList from "./CardList";

interface Props {
    user: User,
    turnPlayer: string,
    selectedCards: CardType[],
    setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>,
    tradeCards: (rank: string) => void,
    betweenRounds: boolean,
}

const TradeController: React.FC<Props> = (props: Props) => {
    const [traded, setTraded] = React.useState<boolean>(false);
    const handleTrade = () => {
        switch(props.user.rank) {
            case 'tycoon':
                if(props.selectedCards.length !== 2) {
                    return;
                }
                break;
            case 'rich':
                if(props.selectedCards.length !== 1) {
                    return;
                }
                break;
            case 'poor':
                if(props.selectedCards.length !== 1) {
                    return;
                }
                break;
            case 'beggar':
                if(props.selectedCards.length !== 2) {
                    return;
                }
                break;
        }
        props.tradeCards(props.user.rank) 
        setTraded(true);
    }
    return (
        <div className="flex flex-col items-center pt-5 pb-5 h-full">
            <h1 className="text-sm md:text-xl text-center"><b>Select valid cards then click "Trade" to trade them.</b></h1>
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
            { !traded && <div className="flex justify-center gap-20 p-5">
                <button onClick={handleTrade} className="w-32 bg-white border-2 border-black shadow shadow-black p-2 hover:bg-gray-200">Trade</button>
            </div>
            }   
        </div>
    );
}

export default TradeController;