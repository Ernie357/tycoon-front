/*
    Checks for a revolution by checking to see if the length of the selected cards is 4,
    since the only way it can be 4 is if all 4 cards match values

    If it is a revolution, the client socket emits a revolution event followed by a
    play cards event, changing the gamestate accordingly
*/

import { CardType } from "../types";
import { Socket } from "socket.io-client";

const checkForRevolution = 
(
    selectedCards: CardType[], 
    socket: Socket | null, 
    id: string | undefined, 
    playerName: string, 
    setSelectedCards: React.Dispatch<React.SetStateAction<CardType[]>>
) => 
{
    if(selectedCards.length === 4) {
        console.log('revolution!');
        socket?.emit('revolution', id);
        socket?.emit('play cards', id, selectedCards, playerName);
        setSelectedCards([]);
        return;
    }
}

export default checkForRevolution;