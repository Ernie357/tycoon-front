import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import joker from './joker.png';
import ryuji from './ryuji.jpg';
import morgana from './morgana.webp';
import ann from './ann.png';
import yusuke from './yusuke.webp';
import makoto from './makoto.webp';
import haru from './haru.png';
import futaba from './futaba.webp';
import akechi from './akechi.png';
import axios from "axios";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

interface FormStateType {
    roomCode: string,
    playerName: string
}

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<FormStateType>({
        roomCode: '',
        playerName: ''
    });
    const [playerImage, setPlayerImage] = useState<string>(ryuji);
    const [webcamOn, setWebcamOn] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [characterIndex, setCharacterIndex] = useState<number>(0);

    const webcamRef = useRef<Webcam>(null);

    const nameLimit = 12;
    const characterImages = [joker, ryuji, morgana, ann, yusuke, makoto, futaba, haru, akechi];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if(!files || !files[0]) {
            return;
        }
        const fileReader = new FileReader();
        const handleFileReaderLoad = () => {
            setPlayerImage(fileReader.result as string);
            setWebcamOn(false);
            fileReader.removeEventListener('load', handleFileReaderLoad, false);
        }
        fileReader.addEventListener('load', handleFileReaderLoad, false);
        fileReader.readAsDataURL(files[0]);
    }
    const handleWebcamToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        setWebcamOn(prev => !prev);
        event.preventDefault();
    }
    const handleCapture = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setWebcamOn(false);
        if(!webcamRef.current) {
            return;
        }
        const capturedImage = webcamRef.current.getScreenshot();
        setPlayerImage(capturedImage as string);
    }, [webcamRef]);
    const handleJoinRoom = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const name = formState.playerName.trim();
        const roomCode = formState.roomCode.trim();
        if(name === '') {
            setErrorMessage('Name cannot be empty.');
            return;
        }
        if(name.includes(' ')) {
            setErrorMessage('Name cannot contain spaces.');
            return;
        }
        if(roomCode === '') {
            setErrorMessage('Room Code cannot be empty.');
            return;
        }
        if(name.length > nameLimit) {
            setErrorMessage(`Name cannot exceed ${nameLimit} characters.`);
            return;
        }
        const isRoomCodeValid = (await axios.get(`https://68.183.135.205:3000/isRoomCodeValid?roomCode=${roomCode}`)).data;
        if(isRoomCodeValid) {
            navigate(roomCode, { state: { playerName: name, playerImage: playerImage } });
        } else {
            setErrorMessage(`Room ${formState.roomCode} does not exist.`);
        }
    }
    useEffect(() => {
        setPlayerImage(characterImages[characterIndex]);
    }, [characterIndex]);
    const handleCreateRoom = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const name = formState.playerName.trim();
        if(name === '') {
            setErrorMessage('Name cannot be empty.');
            return;
        }
        if(name.includes(' ')) {
            setErrorMessage('Name cannot contain spaces.');
            return;
        }
        if(name.length > nameLimit) {
            setErrorMessage(`Name cannot exceed ${nameLimit} characters.`);
            return;
        }
        const newCode = (await axios.get('https://68.183.135.205:3000/roomcode')).data;
        newCode && navigate(`/${newCode}`, { state: { playerName: name, playerImage: playerImage } });
    }
    const handleCharacterBackward = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(characterIndex === 0) {
            setCharacterIndex(characterImages.length - 1);
        } else {
            setCharacterIndex(prev => prev - 1);
        }
    }
    const handleCharacterForward = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
                if(characterIndex === characterImages.length - 1) {
            setCharacterIndex(0);
        } else {
            setCharacterIndex(prev => prev + 1);
        }
    }
    //<div className="hidden lg:block bg-ryuji bg-no-repeat w-6/12 min-h-screen bg-cover flex items-center justify-center" />
    return (
        <div className="flex bg-persona-red 2xl:bg-landing-joker bg-no-repeat object-contain font-main bg-persona-red min-h-screen w-screen overflow-auto">
            <div className="w-full lg:w-6/12 flex flex-col pt-12 items-center h-screen">
                <h1 className="shadow shadow-black text-2xl mb-5 bg-white border-2 border-black p-3 w-3/4 text-center tracking-wider"><b>Welcome to Tycoon.io!</b></h1>
                <form className="h-full w-3/4 flex flex-col gap-5 md:gap-12">
                    <div className="flex items-center gap-5 justify-center">
                        <input 
                            type="text"
                            value={formState.playerName}
                            onChange={handleInputChange}
                            name="playerName"
                            className="shadow shadow-black border-2 border-black p-2 focus:outline-none w-3/4 h-3/4 text-xs md:text-xl md:w-1/2 md:h-full" 
                            placeholder="Enter your name..."
                        />
                        <button 
                            onClick={handleCreateRoom}
                            className="shadow shadow-black bg-white p-3 w-7/12 border-2 border-black text-sm h-3/4 flex items-center justify-center md:text-xl md:h-full md:w-1/4 hover:bg-gray-200"
                        >
                            Create Room
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        <input 
                            type="text"
                            value={formState.roomCode}
                            onChange={handleInputChange}
                            name="roomCode"
                            className="shadow shadow-black border-2 border-black p-2 focus:outline-none w-3/4 h-3/4 text-xs md:text-xl md:w-1/2 md:h-full"
                            placeholder="Enter room code..." 
                        />
                        <button 
                            onClick={handleJoinRoom}
                            className="shadow shadow-black bg-white p-3 w-7/12 border-2 border-black text-sm h-3/4 flex items-center justify-center md:text-xl md:h-full md:w-1/4 hover:bg-gray-200"
                        >
                            Join Room
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-5">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden"
                            id="player_picture_input"
                        />
                        <label 
                            htmlFor="player_picture_input" 
                            className="shadow shadow-black bg-white p-3 border-2 border-black w-3/4 text-center text-sm md:text-xl cursor-pointer hover:bg-gray-200"
                        >
                            Upload Picture
                        </label>
                        <button
                            className="shadow shadow-black bg-white p-3 border-2 border-black w-3/4 text-center text-sm md:text-xl mb-0 md:mb-5 sm:text-sm hover:bg-gray-200"
                            onClick={handleWebcamToggle}
                        >
                            {webcamOn ? 'Close Camera' : 'Take a Picture'}
                        </button>
                        <div className="flex justify-center items-center gap-5 mb-12">
                            { !webcamOn && <button onClick={handleCharacterBackward} className="bg-transparent text-4xl md:text-7xl text-white hover:text-gray-200"><FaArrowAltCircleLeft /></button> }
                            {!webcamOn ?
                            <img 
                                src={playerImage} 
                                alt="Player Icon"
                                className="shadow-2xl shadow-black border-2 border-black aspect-square w-44 lg:w-80 bg-transparent"
                            />
                        : 
                            <div className="flex flex-col items-center gap-5">
                                <Webcam 
                                    height={500} 
                                    width={500} 
                                    ref={webcamRef}
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: 'user' }}
                                    className="border-2 border-black w-1/2 bg-persona-dark-red"
                                />
                                <button 
                                    onClick={handleCapture}
                                    className="shadow shadow-black bg-white p-3 border-2 border-black w-3/4 text-center text-sm md:text-xl mb-0 md:mb-5 sm:text-sm hover:bg-gray-200"
                                >
                                    Capture
                                </button>
                            </div>
                            }
                            { !webcamOn && <button onClick={handleCharacterForward} className="bg-transparent text-4xl md:text-7xl text-white hover:text-gray-200"><FaArrowAltCircleRight /></button> }
                        </div>
                        { errorMessage && <p className="text-sm md:text-2xl mb-12 text-red-500 p-3 bg-white"><b>{errorMessage}</b></p> }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Landing;