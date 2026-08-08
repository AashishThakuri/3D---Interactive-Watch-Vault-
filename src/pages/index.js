import Head from "next/head";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with R3F
const WatchGrid = dynamic(() => import("@/components/grid/WatchGrid"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Chrono Vault — An Immersive 3D Watch Gallery</title>
        <meta
          name="description"
          content="Explore 67 curated timepieces in a cinematic 3D gallery where horology, interaction, and digital art meet."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Aashish Thakuri" />
        <meta name="theme-color" content="#050505" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chrono-vault-green.vercel.app" />
        <meta property="og:title" content="Chrono Vault — An Immersive 3D Watch Gallery" />
        <meta
          property="og:description"
          content="A cinematic digital-art showcase featuring 67 curated timepieces in an explorable 3D gallery."
        />
        <meta property="og:image" content="/bg-watch.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://chrono-vault-green.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WatchGrid />
    </>
  );
}
