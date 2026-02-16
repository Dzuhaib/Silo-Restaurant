import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const galleryImages = [
    "/silo images/gallery section/img1.jpeg",
    "/silo images/gallery section/img2.jpeg",
    "/silo images/gallery section/img3.jpeg",
    "/silo images/gallery section/img4.jpeg",
    "/silo images/gallery section/img5.jpeg",
    "/silo images/gallery section/img6.jpeg",
    "/silo images/gallery section/img7.jpeg",
    "/silo images/gallery section/553969174_122111875838993009_7429346677314185549_n.jpeg",
  ];

  return (
    <>
      <main className={styles.hero}>
        {/* Hero Background */}
        <div className={styles.hero__bg}>
          <Image
            src="/silo images/img1.jpeg"
            alt="The Silo Restaurant outdoor seating"
            fill
            priority
            unoptimized
            className={styles.hero__bg__image}
          />
        </div>

        {/* Ambient glow orbs */}
        <div className={styles.hero__orb1} />
        <div className={styles.hero__orb2} />
        <div className={styles.hero__orb3} />

        <div className={styles.hero__content}>
          {/* Branding */}
          <div className={styles.hero__brand}>
            <p className={styles.hero__subtitle}>Clifton, Karachi</p>
            <h1 className={styles.hero__title}>The Silo</h1>
            <p className={styles.hero__description}>
              Fine dining in Karachi&apos;s exclusive rooftop Sky Domes. Experience Continental
              and Japanese cuisine with air conditioning, music, and a stunning ambiance.
            </p>
          </div>

          {/* CTAs */}
          <div className={styles.hero__actions}>
            <Link href="/reserve">
              <GlassButton variant="accent" size="lg">
                Reserve a Table
              </GlassButton>
            </Link>
            <Link href="/about">
              <GlassButton variant="primary" size="lg">
                Learn More
              </GlassButton>
            </Link>
          </div>

          {/* Divider */}
          <div className={styles.hero__divider} />

          {/* Feature Cards with Images */}
          <div className={styles.hero__features}>
            <GlassCard>
              <div className={styles.feature__image__wrapper}>
                <Image
                  src="/silo images/hero section.jpeg"
                  alt="Sky Dome"
                  width={400}
                  height={300}
                  className={styles.feature__image}
                />
              </div>
              <h3 className={styles.feature__title}>Rooftop Sky Domes</h3>
              <p className={styles.feature__desc}>
                Exclusive private dining in air-conditioned glass pods with breathtaking city views and ambient atmosphere.
              </p>
            </GlassCard>

            <GlassCard>
              <div className={styles.feature__image__wrapper}>
                <Image
                  src="/silo images/gallery section/img3.jpeg"
                  alt="Cuisine"
                  width={400}
                  height={300}
                  className={styles.feature__image}
                />
              </div>
              <h3 className={styles.feature__title}>Continental & Japanese</h3>
              <p className={styles.feature__desc}>
                Expertly crafted cuisine from our curated menu featuring premium Continental and authentic Japanese dishes.
              </p>
            </GlassCard>

            <GlassCard>
              <div className={styles.feature__image__wrapper}>
                <Image
                  src="/silo images/gallery section/img1.jpeg"
                  alt="Outdoor Seating"
                  width={400}
                  height={300}
                  className={styles.feature__image}
                />
              </div>
              <h3 className={styles.feature__title}>Outdoor Seating</h3>
              <p className={styles.feature__desc}>
                Beautiful garden setting with lush greenery, perfect for a relaxed dining experience under the open sky.
              </p>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Gallery Section */}
      <section className={styles.gallery}>
        <div className={styles.gallery__header}>
          <h2 className={styles.gallery__title}>Our Gallery</h2>
          <p className={styles.gallery__subtitle}>
            Discover the ambiance, cuisine, and moments at The Silo
          </p>
        </div>

        <div className={styles.gallery__grid}>
          {galleryImages.map((src, index) => (
            <div key={index} className={styles.gallery__item}>
              <Image
                src={src}
                alt={`The Silo Restaurant gallery image ${index + 1}`}
                fill
                className={styles.gallery__image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
