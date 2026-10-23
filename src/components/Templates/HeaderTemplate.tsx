"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "@/context/AppContext";
import AOS from "aos";
import Link from "next/link";
import Image from "next/image";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const contextInfo = useContext(AppContext);
  const HEADER_MAIN_MENU = contextInfo.headerMenu;
  const [stickyHeader, setStickyHeader] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setStickyHeader(() => window.scrollY > 50);
    });

    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);


  useEffect(() => {
    const clickHandler = (e: any) => {
      if (megaMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
        const menuList = document.querySelectorAll(".menu_wrap li");
        menuList.forEach((list) => {
          list.children[0].classList.remove("active");
        });
      }
    };

    document.addEventListener("mousemove", clickHandler);

    return () => {
      document.removeEventListener("mousemove", clickHandler);
    };
  }, [megaMenuOpen]);

  const menuTriggered = (item: any) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    document.querySelector(".app-container")?.classList.remove("overflow-hidden");
    if (item.type == "click") {
      //contextInfo.setMenuType("page");
    } else {
      //contextInfo.setMenuType(item.type);
    }
  };

  const menuHandler = (event: any) => {
    const currentElem = event.target;
    const hoverItemAttribute = currentElem.getAttribute("data-item");
    const menuItems = document.querySelectorAll(".jsMegaMenuItem");
    const menuList = document.querySelectorAll(".menu_wrap li");
    menuList.forEach((list) => {
      list.children[0].classList.remove("active");
    });
    menuItems.forEach((item) => {
      const itemId = item.getAttribute("id");
      if (hoverItemAttribute === "") {
        setMegaMenuOpen(false);
        currentElem.classList.add("active");
      } else {
        currentElem.classList.add("active");
        if (itemId === hoverItemAttribute) {
          item.classList.remove("hidden");
          setMegaMenuOpen(true);
        } else {
          item.classList.add("hidden");
        }
      }
    });
  };
  const mobileMenuHandler = () => {
    const body = document.querySelector(".app-container");
    setMobileMenuOpen((prev) => !prev);
    body?.classList.toggle("overflow-hidden");
  };

  return (
    <header className={`c-header ${stickyHeader ? 'sticky_header' : ''}`} ref={menuRef}>
      <div className="container custom_container">
        <div className="c-header__main">
          <div className="c-header__logo">
            <Link href="/">
              <Image
                src='/logos/jspl-main-logo.svg'
                alt="Jindal Foundation"
                width={190}
                height={80} />
            </Link>
          </div>
          <nav className="c-header__nav">
            <ul className="c-header__menu">
              {HEADER_MAIN_MENU.map((menu: any, index: any) => {
                const dataItem = menu.name.split(" ").join("_");
                return (
                  <li key={index}>
                    <Link className={menu.children.length > 0 ? "jsMegaMenuItem" : ""} onMouseOver={menuHandler} href={menu.link.split('.html')[0]} data-item={menu.children.length > 0 ? dataItem : ""}>
                      {menu.name}

                    </Link>
                  </li>
                )
              })}
              {/* Search Section */}
            </ul>
            <button className={`c-header__nav-hamburger ${mobileMenuOpen ? "active" : ""}`} onClick={mobileMenuHandler}>
              <Image src='/images/icons/menu.png' alt="hamburger icon" width={30} height={30} />
            </button>
          </nav>
        </div>
      </div>
      <MobileMenu menuState={mobileMenuOpen} menuTrigger={menuTriggered} />
      <MegaMenu data={HEADER_MAIN_MENU} menuState={megaMenuOpen} menuTrigger={menuTriggered} />
    </header>
  );
}

export default Header;