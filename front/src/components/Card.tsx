import { useState } from "react";
import { User } from "../pages/Game/types";

interface CardType {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

interface Props {
    card: CardType,
    selectedCards: CardType[],
    setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>,
    isSelectable: boolean,
    betweenRounds: boolean,
    user: User
}

const Card: React.FC<Props> = ({ card, selectedCards, setSelectedCards, isSelectable, betweenRounds, user }: Props) => {
    const [selected, setSelected] = useState<boolean>(false);
    if(!card) {
        return <></>;
    }
    const canSelect = () => {
        if(betweenRounds) {
            if(user.rank === 'poor' || user.rank === 'rich') {
                if(user.possibleTradeCardNumbers.includes(card.numberValue) && selectedCards.length < 1 && !selected) {
                    return true;
                } else {
                    return false;
                }
            }
            if(user.possibleTradeCardNumbers.includes(card.numberValue) && selectedCards.length < 2 && !selected) {
                return true;
            } else {
                return false;
            }
        } else {
            if(selectedCards.length >= 4) {
                return false;
            }
            if(selectedCards.length === 0) {
                return true;
            }
            if(card.faceValue === 'Joker' && !selected) {
                return true;
            }
            for(let idx = 0; idx < selectedCards.length; idx++) {
                const cur = selectedCards[idx];
                if(cur.faceValue === card.faceValue && cur.suit === card.suit) {
                    return false;
                }
                if(cur.faceValue !== card.faceValue && cur.faceValue !== 'Joker') {
                    return false;
                }
            }
        }
        return true;
    }
    const handleSelect = () => {
        if(!isSelectable) { return; }
        setSelected(prev => {
            if(prev) {
                return false;
            }
            if(canSelect()) {
                return true;
            }
            return false;
        });
        setSelectedCards(prev => {
            if(canSelect()) {
                return [...prev, card];
            }
            return prev.filter(selectedCard => selectedCard !== card);
        });
    }
    return (
        <img 
            src={`/images/${card.image}`} 
            alt={`${card.faceValue} of ${card.suit}`}
            className={`md:max-w-16 lg:max-w-20 xl:max-w-24 max-w-12 cursor-pointer ${selected && 'border-4 border-black'}`}
            onClick={handleSelect}
        />
    );
}

export default Card;