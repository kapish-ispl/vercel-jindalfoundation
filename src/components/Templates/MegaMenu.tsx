import Link from "next/link";
import { FC } from "react";

type ChildProps = {
    id: number;
    name: string;
    link: string;
    type: string;
    children?: any;
};

type Props = {
    id: number;
    name: string;
    description?: string;
    link: string;
    children: ChildProps[];
};

const MegaMenu: FC<{ data: Props[]; menuState: boolean; menuTrigger: any }> = ({ menuState, data, menuTrigger }) => {
    return (
        <div className={`mega_menu ${menuState ? "active" : ""}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="mega_menu_wrapper">
                            {data !== undefined
                                ? data.length > 0 &&
                                data.filter((filterData) => filterData.children.length > 0)
                                    .map((menuItem: Props) => {
                                        const dataItem = menuItem.name.split(" ").join("_");
                                        return (
                                            <div key={menuItem.id} className="mega_menu_items jsMegaMenuItem hidden" id={dataItem}>
                                                <div className="row">
                                                    <div className="col-8">
                                                        <ul className="mega_menu_sub_menu">
                                                            {menuItem.children.map((subMenu: ChildProps) => {
                                                                const thirdLevelMenu = subMenu.children !== undefined ? subMenu.children : "";
                                                                return (
                                                                    <li key={subMenu.id} className={`mega_menu_sub_item ${thirdLevelMenu.length > 0 ? "dropdown" : ""}`} onClick={() => menuTrigger()}>
                                                                        <Link href={subMenu.link.split(".html")[0]} target={subMenu.type === 'external' ? '_blank' : '_self'}>
                                                                            {subMenu.name}
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
