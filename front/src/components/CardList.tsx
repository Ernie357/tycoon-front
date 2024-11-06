import { User } from "../pages/Game/types";
import Card from "./Card";

interface CardType {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

interface Props {
    cards: CardType[],
    selectedCards: CardType[],
    setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>,
    turnPlayer: string,
    playerName: string,
    cardsAreSelectable: boolean,
    betweenRounds: boolean,
    user: User
}

const CardList: React.FC<Props> = (props: Props) => {
    const cardElements = props.cards.map((card: CardType) => <Card card={card} selectedCards={props.selectedCards} setSelectedCards={props.setSelectedCards} key={card.image} isSelectable={props.cardsAreSelectable} betweenRounds={props.betweenRounds} user={props.user} />);
    return (
        <div className="grid grid-cols-4 md:grid-cols-7 grid-rows-4 md:grid-rows-2 grid-flow-row justify-center gap-5 p-5">
            {cardElements}
        </div>
    );
}

export default CardList;