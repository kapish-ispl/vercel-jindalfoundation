"use client";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

const initialState = [
    {
        id: 1,
        label: "Home",
        url: "/",
    },
];

const Breadcrumbs = ({ slug, currentPage }: any) => {
    const { headerMenu } = useContext(AppContext);
    const [menuExist, setMenuExist] = useState(false);
    const [breadcumbMenu, setBreadcumbMenu] = useState(initialState);

    useEffect(() => {
        const buildBreadcrumbs = (
            menuItem: any,
            slug: string,
            currentBreadcrumbs: { id: number; label: string; url: string }[]
        ): { id: number; label: string; url: string }[] | null => {
            const breadcrumbs = [
                ...currentBreadcrumbs,
                { id: menuItem.id, label: menuItem.name, url: menuItem.link },
            ];

            if (menuItem.link === `/${slug}`) {
                return breadcrumbs;
            }

            if (currentPage.taxonomy) {
                const isJFAllPublications = currentPage.taxonomy.slug === "jf-all-publications";
                const breadcrumbsParent = [
                    ...currentBreadcrumbs,
                    {
                        id: currentPage.taxonomy.id,
                        label: isJFAllPublications ? "Publications" : currentPage.taxonomy.name,
                        url: `/${isJFAllPublications ? "publications" : currentPage.taxonomy.slug}`,
                    },
                    { id: currentPage.id, label: currentPage.title, url: "" },
                ];
                return breadcrumbsParent;
            }

            if (
                menuItem.link !== `/${slug}.html` &&
                menuItem.link === `/${currentPage.parentPageDetails?.slug}`
            ) {
                const breadcrumbsParent = [
                    ...currentBreadcrumbs,
                    {
                        id: currentPage.parentPageDetails.id,
                        label: currentPage.parentPageDetails.title,
                        url: `/${currentPage.parentPageDetails.slug}`,
                    },
                    { id: currentPage.id, label: currentPage.title, url: "" },
                ];
                return breadcrumbsParent;
            }

            if (menuItem.children && menuItem.children.length > 0) {
                for (const child of menuItem.children) {
                    const result = buildBreadcrumbs(child, slug, breadcrumbs);
                    if (result) return result;
                }
            }

            return null;
        };

        let foundBreadcrumbs: { id: number; label: string; url: string }[] | null = null;

        for (const menuItem of headerMenu) {
            const result = buildBreadcrumbs(menuItem, slug, initialState);
            if (result) {
                foundBreadcrumbs = result;
                break;
            }
        }

        const hasMenu = !!foundBreadcrumbs;
        setMenuExist(hasMenu);

        if (hasMenu) {
            setBreadcumbMenu(foundBreadcrumbs!);
        } else {
            setBreadcumbMenu([
                ...initialState,
                {
                    id: currentPage.id,
                    label: currentPage.title,
                    url: "",
                },
            ]);
        }
    }, [slug, headerMenu, currentPage]);

    return (
        <ul className="breadcrumb">
            {breadcumbMenu.map((crumb: any, index: number) => {
                const isLast = index === breadcumbMenu.length - 1;
                return (
                    <li key={crumb.id} className="breadcrumb-item">
                        {isLast || !crumb.url ? (
                            <span>{crumb.label}</span>
                        ) : (
                            <Link href={crumb.url}>{crumb.label}</Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default Breadcrumbs;
