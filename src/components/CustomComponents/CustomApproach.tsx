import React, { FC, useEffect, useState, ReactElement } from "react";

interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

interface CustomCard {
    props: CardProps;
    cardKey: number;
}

interface DataItem {
    props?: {
        children?: React.ReactNode[];
    };
}

interface CustomApproachProps {
    data: any[];
}

const CustomApproach = ({ data }: any) => {
    const [activeCardId, setActiveCardId] = useState<number | null>(0);
    const [activeKeyCard, setActiveKeyCard] = useState<number | null>(1);

    const finalData = Object.values(data).filter((item: any) => item?.props !== undefined);

    const filteredData = finalData
        .filter((item: any) => Array.isArray(item?.props?.children))
        .map((item: any) => {
            const validChildren = item.props!.children!.filter((child: any) => child !== undefined);
            return {
                ...item,
                props: {
                    ...item.props,
                    children: validChildren,
                },
            };
        });

    const filterCardArray: any = filteredData.map((item, index) => ({
        ...(item.props!.children![1] as ReactElement),
        cardKey: index + 1,
    }));

    const filterCardInfo: any = filteredData.map((item, index) => ({
        ...(item.props!.children![3] as ReactElement),
        cardKey: index + 1,
    }));

    const useDeviceType = () => {
        const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

        useEffect(() => {
            const checkDevice = () => {
                const width = window.innerWidth;
                if (width < 768) setDeviceType("mobile");
                else if (width < 1024) setDeviceType("tablet");
                else setDeviceType("desktop");
            };

            checkDevice();
            window.addEventListener("resize", checkDevice);
            return () => window.removeEventListener("resize", checkDevice);
        }, []);

        return deviceType;
    };

    const deviceType = useDeviceType();
    const groupSize = deviceType === "mobile" ? 1 : deviceType === "tablet" ? 2 : 3;

    const groupedCards: CustomCard[][] = [];
    for (let i = 0; i < filterCardArray.length; i += groupSize) {
        groupedCards.push(filterCardArray.slice(i, i + groupSize));
    }
    const handelKeyCard = (id: number) => {
        setActiveKeyCard(id)
    }

    return (
        <>
            <div className="row mb-4">
                <div className="col-12 keyCardComp">
                    <div className={`adjustable_design_item ${activeKeyCard === 1 && 'active'}`} onClick={() => handelKeyCard(1)}>
                        <div className="adjustable_design_item_text">
                            <h3 className="cus_text60 text-white font-light">360° Approach</h3>

                            <p className="cus_para">The Foundation adopts a 360° approach to integrate sustainability and social and ecological resilience across all stakeholders. This strategy drives the successful implementation and adoption of community projects by fostering capacity building, collaboration, and community ownership. Aligned with the UN SDGs, our initiatives emphasise inclusive and sustainable development.</p>
                        </div>
                    </div>
                    <div className={`adjustable_design_item ${activeKeyCard === 2 && 'active'}`} onClick={() => handelKeyCard(2)}>
                        <div className="adjustable_design_item_text">
                            <h3 className="cus_text60 text-white font-light">Need-Based Approach</h3>

                            <p className="cus_para">The Jindal Foundation's approach is rooted in sustainability and community partnerships. It empowers communities to identify needs, plan implementation, form partnerships, and oversee their development projects. Tools like Participatory Rural Appraisal (PRA), Need-Profile Analysis, and Need Prioritisation ensure effective community participation. Aligned with Schedule VII of the Companies Act 2013, these CSR initiatives prioritise sustainability and self-reliance.</p>
                        </div>
                    </div>
                    <div className={`adjustable_design_item ${activeKeyCard === 3 && 'active'}`} onClick={() => handelKeyCard(3)}>
                        <div className="adjustable_design_item_text">
                            <h3 className="cus_text60 text-white font-light">UN SDG</h3>

                            <p className="cus_para">The Foundation aligns its CSR initiatives with the UN's 17 Sustainable Development Goals, promoting innovation through global, national, and local partnerships. These initiatives, aligned with Schedule VII of the Companies Act 2013 focus on creating shared value, particularly in education. The Foundation drives inclusive and sustainable development by fostering collaboration among industry, academia, policymakers, and communities.</p>
                        </div>
                    </div>
                </div>
            </div>

            {
                activeKeyCard === 3 ?
                    <>
                        <div className="col-12 mb-4">
                            <h3 className="text-gray font-bold"><strong>Key Interventions by the Jindal Foundation</strong></h3>
                        </div>
                        {groupedCards.map((group, rowIndex) => {
                            const rowHasActive = group.some(card => card.cardKey === activeCardId);

                            return (
                                <>
                                    <div className="row" key={rowIndex}>
                                        {group.map((card, index) => (
                                            <div className="col-md-6 col-lg-4 col-sm-12" key={index}>
                                                <div
                                                    className={`${card.props.className} ${activeCardId === card.cardKey && "activeCard"}`}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setActiveCardId(card.cardKey)}
                                                >
                                                    {card.props.children}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {rowHasActive && (() => {
                                        const card = filterCardInfo.find((c: any) => c.cardKey === activeCardId);
                                        return card?.props?.children ? (
                                            <div className="mb-4">
                                                {card.props.children}
                                            </div>
                                        ) : null;
                                    })()}
                                </>
                            );
                        })
                        }
                    </>
                    :
                    null
            }
        </>
    );
};

export default CustomApproach;
