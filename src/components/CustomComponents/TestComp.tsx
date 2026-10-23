// CardGrid.tsx
import { useEffect, useState } from "react";

type Card = {
    id: number;
    title: string;
    content: string;
    details: string;
};

const cards: Card[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    content: `Content for card ${i + 1}`,
    details: `Detailed info about card ${i + 1}`,
}));

const TestComp = () => {
    const [activeCardId, setActiveCardId] = useState<number | null>(1);
    const [activeKeyCard, setActiveKeyCard] = useState<number | null>(null);
    // const [currentData, setCurrentData] = useState<number | null>(null);
    const useIsMobile = (breakpoint = 768) => {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            const check = () => setIsMobile(window.innerWidth < breakpoint);
            check();
            window.addEventListener("resize", check);
            return () => window.removeEventListener("resize", check);
        }, [breakpoint]);

        return isMobile;
    };
    const isMobile = useIsMobile();

    const groupedCards = [];
    if (isMobile) {
        for (let i = 0; i < cards.length; i++) {
            groupedCards.push([cards[i]]);
        }
    } else {
        for (let i = 0; i < cards.length; i += 3) {
            groupedCards.push(cards.slice(i, i + 3));
        }
    }

    const handelKeyCard = (id: number) => {
        setActiveKeyCard(id)
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className={`col-4 key-card ${activeKeyCard === 1 && 'card-active'}`} onClick={() => handelKeyCard(1)}>
                    <h3>NEW PROJECT DEVELOPMENT</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi debitis quas pariatur, consectetur iusto optio, enim magnam doloribus porro necessitatibus earum, dolor architecto natus. Asperiores assumenda adipisci cumque placeat eius sequi facilis nisi ullam atque.
                    </p>
                </div>
                <div className={`col-4 key-card ${activeKeyCard === 2 && 'card-active'}`} onClick={() => handelKeyCard(2)}>
                    <h3>NEED-BASED APPROACH</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi debitis quas pariatur, consectetur iusto optio, enim magnam doloribus porro necessitatibus earum, dolor architecto natus. Asperiores assumenda adipisci cumque placeat eius sequi facilis nisi ullam atque.
                    </p>
                </div>
                <div className={`col-4 key-card ${activeKeyCard === 3 && 'card-active'}`} onClick={() => handelKeyCard(3)}>
                    <h3>UN SDG</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi debitis quas pariatur, consectetur iusto optio, enim magnam doloribus porro necessitatibus earum, dolor architecto natus. Asperiores assumenda adipisci cumque placeat eius sequi facilis nisi ullam atque.
                    </p>

                </div>
            </div>
            <div className={`${activeKeyCard !== 3 && 'd-none'}`}>
                {groupedCards.map((group, rowIndex) => {
                    const rowHasActive = group.some(card => card.id === activeCardId);

                    return (
                        <div key={rowIndex} className="mb-4">
                            <div className="row">
                                {group.map((card) => (
                                    <div className="col-md-4 mb-3" key={card.id}>
                                        <div
                                            className="card h-100"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                if (activeCardId !== card.id) {
                                                    setActiveCardId(card.id);
                                                }
                                            }}
                                        >
                                            {/* <img src={card.image} className="card-img-top" alt={card.title} /> */}
                                            <div className="card-body">
                                                <h5 className="card-title">{card.title}</h5>
                                                <p className="card-text">{card.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: show expanded content after the row */}
                            {rowHasActive && (
                                <div className="card mt-2">
                                    <div className="card-body">
                                        {cards.find(c => c.id === activeCardId)?.details}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestComp;
