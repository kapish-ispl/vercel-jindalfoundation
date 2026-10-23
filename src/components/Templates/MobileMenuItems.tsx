"use client";
import { ARROW_V5 } from "@/config/icons";
import Link from "next/link";

const MobileMenuItems = ({ item, menuTrigger, index, activeIndex, setActiveIndex }: any) => {

    const handleAccordionClick = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    if (item.children && item.children.length > 0) {
        return (
            <div className={activeIndex === index ? "mobile_menu_item open" : "mobile_menu_item"}>
                <div className="mobile_menu_item_title" onClick={() => handleAccordionClick(index)}>
                    <span>{item.name}</span>
                    <span className="icon transition duration-150 ease-in-out">
                        {ARROW_V5}
                    </span>
                </div>
                <div className="sidebar-content">
                    {item.children.map((child: any) => (
                        <MobileMenuItems menuTrigger={menuTrigger} key={child.id} item={child} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <Link onClick={menuTrigger} href={item.link.split(".html")[0]} className="mobile_menu_item_title">
                <span>{item.name}</span>
            </Link>
        );
    }
};

export default MobileMenuItems;
