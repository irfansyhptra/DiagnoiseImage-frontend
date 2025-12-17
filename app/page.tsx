"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Landing.module.css";

const members = [
  {
    name: "IRFAN SYAHPUTRA",
    role: "Bertanggung jawab sebagai pengembang backend dan infrastruktur sistem, mulai dari perancangan API untuk proses denoising wajah, integrasi model autoencoder ke dalam layanan server, hingga pengaturan lingkungan eksekusi dan deployment aplikasi.",
    npm: "2308107010030",
    photo: "/team/irfan.png",
  },
  {
    name: "KHAIRUN NISA",
    npm: "230810701001O",
    role: "Bertanggung jawab sebagai peneliti dan pengembang model autoencoder, mencakup studi literatur, perancangan arsitektur jaringan, pelatihan model pada dataset wajah ber‑noise, serta analisis performa hasil denoising.",
    photo: "/team/nicun.png",
  },
  {
    name: "ANISA RAMADHANI",
    npm: "2308107010008",
    role: "Bertanggung jawab sebagai pengelola data, penguji sistem, perancang desain UI/UX, dan penulis dokumentasi, meliputi penyusunan dan pengelolaan dataset wajah, pengujian kualitas hasil denoising secara end‑to‑end, mendesain antarmuka pengguna yang menarik, serta penyusunan laporan proyek yang menjelaskan cara instalasi, penggunaan, dan ringkasan hasil penelitian.",
    photo: "/team/nisa.png",
  },
  {
    name: "BUNGA RASIKHAH HAYA",
    npm: "2308107010010",
    role: "Bertanggung jawab sebagai pengembang frontend dan perancang antarmuka pengguna, fokus pada pembuatan halaman landing dan halaman denoising di Next.js, pengaturan tampilan before–after citra, serta perancangan pengalaman pengguna yang responsif dan konsisten dengan tema visual sistem.",
    photo: "/team/bunga.png",
  },
];

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!cardRefs.current || cardRefs.current.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.main}>
      {/* Gradient blur effect */}
      <div className={styles.gradientWrapper}>
        <div className={styles.blueBlur} />
        <div className={styles.purpleBlur} />
        <div className={styles.magentaBlur} />
      </div>

      {/* ========== HERO: video hanya di section ini ========== */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgVideoWrapper}>
          <video
            className={styles.heroBgVideo}
            src="/13160995_3840_2160_30fps.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/faceclean_hero.jpg"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Face Denoising Autoencoder
            </div>
            <h1 className={`${styles.title} ${styles.bebasHeading}`}>
              Bersihkan noise wajah
              <br />
              untuk era Face AI yang lebih tajam
            </h1>
            <p className={styles.desc}>
              FaceClean membersihkan noise, artefak kompresi, dan grain pada
              citra wajah dengan Convolutional Autoencoder yang dilatih khusus
              dataset wajah. Ideal untuk face recognition, presensi, dan arsip
              digital.
            </p>
            <p className={styles.subDesc}>
              Klik Start, unggah foto wajah, dan lihat perbandingan sebelum dan
              sesudah secara instan.
            </p>
            <a
              href="/denoise"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={
                isHovered
                  ? `${styles.startButton} ${styles.startButtonHovered}`
                  : styles.startButton
              }
              style={{ position: "relative", overflow: "hidden" }}
            >
              <span className={styles["submitButton-orbit"]}>
                <span className={styles["submitButton-orbit-ball"]}></span>
              </span>
              Start
            </a>
          </div>
        </div>
      </section>
      {/* ========== END HERO ========== */}

      {/* OUR TEAM section */}
      <section className={styles.teamSection}>
        <header className={styles.teamHeader}>
          <h2 className={styles.teamHeadingTop}>OUR OUTSTANDING</h2>
          <h3 className={styles.teamHeadingBottom}>TEAM</h3>
          <div className={styles.teamDivider} />
        </header>

        <div className={styles.teamList}>
          {members.map((m, index) => (
            <article
              key={m.name}
              ref={(el: HTMLElement | null) => {
                cardRefs.current[index] = el;
              }}
              className={
                index % 2 === 0
                  ? `${styles.teamCard} ${styles.teamCardEven}`
                  : styles.teamCard
              }
            >
              <div className={styles.teamPhotoWrapper}>
                <Image
                  src={m.photo}
                  alt={m.name}
                  width={340}
                  height={420}
                  className={styles.teamPhoto}
                />
              </div>
              <div className={styles.teamInfo}>
                <h4 className={styles.teamName}>{m.name}</h4>
                <h4 className={styles.teamNpm}>NPM: {m.npm}</h4>
                <p className={styles.teamRole}>{m.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}