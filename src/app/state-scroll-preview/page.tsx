import StateFootprintScroll from "@/components/CustomComponents/StateFootprintScroll";

/**
 * Local preview for the pinned footprint scroller.
 * Safe to delete — the component is also wired into PageTemplate as <statefootprintscroll />.
 */
export default function StateScrollPreviewPage() {
    return (
        <main>
            <section style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
                <p>Scroll down to enter the pinned map section.</p>
            </section>

            <StateFootprintScroll />

            <section style={{ minHeight: "80vh", display: "grid", placeItems: "center" }}>
                <p>Content after the pinned section.</p>
            </section>
        </main>
    );
}
