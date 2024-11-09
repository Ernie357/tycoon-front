interface CardType {
    faceValue: string,
    numberValue: string,
    suit: string,
    image: string
}

interface User {
    name: string,
    image: string,
    cards: CardType[],
    points: number,
    rank: string
}

interface Props {
    user: User,
    host: string
}

const UserBox: React.FC<Props> = ({ user, host }: Props) => {
    return (
        <div className="shadow shadow-black bg-white w-36 md:w-52 2xl:w-64 xl:w-64 border-2 border-black p-3 flex flex-col items-center h-full">
            <p className="text-xs lg:text-xl tracking-wide text-center"><b>{user.name}{host === user.name && ' (Host)'}</b></p>
            <img 
                src={user.image} 
                alt={`${user.name} player icon`} 
                className="aspect-square w-24 lg:w-44 m-3 border-2 border-black shadow shadow-black"
            />
            { user.cards && <p className="text-xs lg:text-lg text-center"># of Cards: {user.cards.length}</p> }
            { <p className="text-xs lg:text-lg text-center">Points: {user.points}</p> }
            {user.rank && <p>Rank: {user.rank}</p>}
        </div>
    );
}

export default UserBox;