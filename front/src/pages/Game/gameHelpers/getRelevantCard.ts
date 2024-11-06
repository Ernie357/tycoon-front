/*
    Gets the card with the relevant value out of a list of up to 4 cards

    This function essentially grabs the first card that is not a Joker

    If Jokers comprise the entire list, Joker is the relevant card

    If there are no cards in the list given, a default "empty" card object is returned
*/

import { CardType } from "../types";

const getRelevantCard = (cards: CardType[]): CardType => {
    if(cards.length === 0) {
        return {
            faceValue: '0',
            numberValue: '0',
            suit: '',
            image: ''
        }
    }
    for(let i = 0; i < cards.length; i++) {
        const cur = cards[i];
        if(cur.faceValue !== 'Joker') {
            return cur;
        }
    }
    return cards[0];
}

export default getRelevantCard;

