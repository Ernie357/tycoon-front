import { Message } from "../pages/Game/types"

interface Props {
    message: Message
}

const DialogueBox: React.FC<Props> = (props: Props) => {
    return (
        <div className="hidden 2xl:flex items-center self-center justify-center w-full scale-50 lg:scale-75 ml-36">
            <img alt='chat profile picture' src={props.message.sender?.image} className="w-1/4 border-2 border-black shadow-2xl shadow-black" />
            <div className="w-110-p flex-shrink-0 h-96 bg-persona-dialogue-box bg-no-repeat object-contain">
                <p className="text-4xl text-center relative top-16 left-32 rotate-dialogue-name w-64 tracking-wider"><b>{props.message.sender?.name}</b></p>
                <p className="text-3xl text-white relative top-28 left-48 w-1/2 h-24 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">{props.message.content}</p>
            </div>
        </div>
    );
}

export default DialogueBox;