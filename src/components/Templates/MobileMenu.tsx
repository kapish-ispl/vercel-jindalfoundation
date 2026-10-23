"use client";
import { FC, useContext, useState } from "react"
import MobileMenuItems from "./MobileMenuItems";
import { AppContext } from "@/context/AppContext";

type Props = any;

const MobileMenu: FC<Props> = ({ menuState, menuTrigger }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const contextInfo = useContext(AppContext);
    const HEADER_MAIN_MENU = contextInfo.headerMenu;

    return (
        <div className={`mobile_menu ${menuState ? 'active' : ''}`}>
            <div className="mobile_menu_wrapper">
                {HEADER_MAIN_MENU !== undefined && HEADER_MAIN_MENU.map((item: any, index: number) => 
                <MobileMenuItems key={item.id} item={item} menuState={menuState} menuTrigger={menuTrigger} index={index} activeIndex={activeIndex}
                setActiveIndex={setActiveIndex} />)}
            </div>
        </div>
    )
}

export default MobileMenu;