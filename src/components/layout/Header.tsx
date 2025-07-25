import "@/components/layout/css/Header.css"
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegCompass } from "react-icons/fa6";

export default function Header(){
    return(
        <div className="flex flex-row w-full p-3 h-[70px] bg-gray-900">
            <div className="header Column w-1/3 flex flex-row">
                <div className="w-1/6 self-center"><span className="headerBtnText">--LOGO--</span></div>
                <div className="w-1/6 self-center"><span className="headerBtnText">OZCAB</span></div>
            </div>
            <div className="headerColumn w-2/3 flex flex-row justify-end pr-4 ">
                <div className="w-3/12   flex justify-center items-center">
                    <button  className="flex flex-row w-full justify-center gap-4" >
                        <span className="headerBtnText self-center">Mapa de Sitio</span>
                        <FaRegCompass size={24} color="white"className="self-center"/>
                    </button>
                </div>
                <div className="w-1/12 flex justify-center"><RxHamburgerMenu size={30} color="white" className="self-center"/></div>
            </div>
        </div>
    );

};