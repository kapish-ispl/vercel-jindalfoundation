import { Bebas_Neue, Poppins } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "aos/dist/aos.css";
import "@/styles/globals.scss";
import "@/styles/custom.scss";
import AppContextProvider from "@/context/AppContext";
import Header from "@/components/Templates/HeaderTemplate";
import Footer from "@/components/Templates/FooterTemplate";
import { getMenuData } from "@/lib/getMenuData";
import { GoogleTagManager } from '@next/third-parties/google'

const genericFont = Poppins({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const secondaryFont = Bebas_Neue({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: "400"
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { headerMenu, footerBottomMenu, footerContent } = await getMenuData();
  return (
    <html suppressHydrationWarning={true} lang="en">
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <GoogleTagManager gtmId="GTM-TDJJ29SR" />
      <body className={`app-container ${genericFont.variable}  ${secondaryFont.variable}`}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TDJJ29SR"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
          </iframe>
        </noscript>
        <AppContextProvider initialHeaderMenu={headerMenu} initialFooterBottomMenu={footerBottomMenu} initialFooterContent={footerContent}>
          <Header />
          <main className="app-mainWrapper">
            {children}
          </main>
          <Footer />
        </AppContextProvider>
      </body>
    </html >
  );
}
