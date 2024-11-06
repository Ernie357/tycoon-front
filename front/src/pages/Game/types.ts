export interface CardType {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

export interface User {
    name: string,
    image: string,
    cards: CardType[],
    points: number,
    rank: string,
    possibleTradeCardNumbers: string[],
    cardsFromTrade: CardType[]
}

export interface Message {
    sender: User | null,
    content: string
}

export interface GameState {
    activeCards: CardType[],
    roundNumber: number,
    users: User[],
    turnPlayer: string,
    passCount: number,
    activeUsers: User[],
    revolution: boolean,
    betweenRounds: boolean,
    numTradesMade: number,
    tycoonLost: boolean,
    gameIsActive: boolean,
    host: string,
    messages: Message[],
    roomCode: string
}