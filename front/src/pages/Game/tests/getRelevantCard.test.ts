import getRelevantCard from "../gameHelpers/getRelevantCard";
import { CardType } from "../types";
import { blackJoker, redJoker, threeOfHearts, threeOfSpades, queenOfClubs, threeOfDiamonds } from './mockCards';

describe("Get Relevant Card Tests", () => {

    it("Should return an empty card if the an empty card list is given", () => {
        const cards: CardType[] = [];
        const outputCard = getRelevantCard(cards);
        const expectedOutput = {
            faceValue: '0',
            numberValue: '0',
            suit: '',
            image: ''
        }
        expect(outputCard).toStrictEqual(expectedOutput);
    });

    it("Should see a joker as the relevant card if input is all jokers", () => {
        const cards = [blackJoker, redJoker];
        const outputCard = getRelevantCard(cards);
        const outputFaceValue = outputCard.faceValue;
        expect(outputFaceValue).toBe('Joker');
    });

    it("Should grab the first non-joker card when jokers are present but input is not all jokers", () => {
        let cards = [blackJoker, threeOfHearts, threeOfSpades, threeOfDiamonds];
        let outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [blackJoker, redJoker, threeOfSpades, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Spades');

        cards = [threeOfHearts, redJoker, threeOfSpades, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [threeOfHearts, redJoker, blackJoker, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [threeOfHearts, blackJoker, threeOfSpades, redJoker];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [blackJoker, queenOfClubs];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [queenOfClubs, blackJoker];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [queenOfClubs, blackJoker, redJoker];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [redJoker, queenOfClubs, blackJoker];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');
    });

    it("Should grab the first card when there are no jokers", () => {
        let cards = [threeOfHearts, threeOfSpades, threeOfDiamonds];
        let outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [threeOfSpades, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Spades');

        cards = [threeOfHearts, threeOfSpades, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [threeOfHearts, threeOfDiamonds];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [threeOfHearts, threeOfSpades];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('3');
        expect(outputCard.suit).toBe('Hearts');

        cards = [queenOfClubs];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [queenOfClubs];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [queenOfClubs];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [queenOfClubs];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');
    });

    it("Should grab the card when there is one card", () => {
        let cards = [queenOfClubs];
        let outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Queen');
        expect(outputCard.suit).toBe('Clubs');

        cards = [redJoker];
        outputCard = getRelevantCard(cards);
        expect(outputCard.faceValue).toBe('Joker');
    });
});