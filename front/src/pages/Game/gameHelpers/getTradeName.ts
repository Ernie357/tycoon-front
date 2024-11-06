import { User } from "../types";

const getTradeName = (rank: string, users: User[]): string => {
    switch(rank) {
        case 'beggar': 
            for(let idx = 0; idx < users.length; idx++) {
                if(users[idx].rank === 'tycoon') {
                    return users[idx].name;
                }
            }
            return 'Player not found for beggar trade';
        case 'poor': 
            for(let idx = 0; idx < users.length; idx++) {
                if(users[idx].rank === 'rich') {
                    return users[idx].name;
                }
            }
            return 'Player not found for poor trade';
        case 'rich': 
            for(let idx = 0; idx < users.length; idx++) {
                if(users[idx].rank === 'poor') {
                    return users[idx].name;
                }
            }
            return 'Player not found for rich trade';
        case 'tycoon': 
            for(let idx = 0; idx < users.length; idx++) {
                if(users[idx].rank === 'beggar') {
                    return users[idx].name;
                }
            }
            return 'Player not found for tycoon trade';
        default: 
            return 'Player not found for card trade'
    }
}

export default getTradeName;