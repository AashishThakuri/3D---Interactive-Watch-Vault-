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
        <title>Chrono Vault — Premium Watch Finder</title>
        <meta name="description" content="Explore our curated collection of luxury, sport, and everyday timepieces in an immersive 3D experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Aashish Thakuri" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WatchGrid />
    </>
  );
}
