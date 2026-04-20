import type { SiteConfig } from "@/site.config";
import styles from "@/app/about/about.module.css";

export function AboutContent({ site }: { site: SiteConfig }) {
  const li = site.links.linkedin;

  return (
    <>
      <header>
        <h1 className={styles.h1}>Zain Ali</h1>
        <p className={styles.headline}>Software Engineer · Mastercard</p>
        <p className={styles.meta}>New York City metropolitan area</p>
        <ul className={styles.contact}>
          <li>
            <a href={li} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          {site.links.email && (
            <li>
              <a href={`mailto:${site.links.email}`}>{site.links.email}</a>
            </li>
          )}
        </ul>
      </header>

      <section className={styles.section} aria-labelledby="summary-heading">
        <h2 id="summary-heading" className={styles.sectionTitle}>
          Summary
        </h2>
        <p className={styles.summary}>
          Backend and platform-oriented software engineer working on
          large-scale ecommerce and supply-chain systems. Currently at
          Mastercard on the team behind Click to Pay and Secure Card on File, Mastercard&apos;s
          implementation of the EMV Secure Remote Commerce standard.
          Previously shipped ecommerce order-fulfillment services at Walmart Global
          Tech. Rutgers University–New Brunswick B.A. in Computer Science and
          Psychology.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="exp-heading">
        <h2 id="exp-heading" className={styles.sectionTitle}>
          Experience
        </h2>

        <div className={styles.role}>
          <p className={styles.roleTitle}>Software Engineer — Mastercard</p>
          <p className={styles.roleMeta}>Aug 2022 – Present · New York, NY</p>
          <p className={styles.roleMeta}>
            Secure Remote Commerce (SRC) · Mastercard Checkout Services (MACS)
          </p>
          <p className={styles.roleMeta}>
            Stack: Java · Spring Boot · Microservices · PCF · Oracle · Postman
          </p>
          <ul className={styles.roleDetail}>
            <li>
              Work on the platform behind Click to Pay and Secure Card on File — Mastercard&apos;s
              implementation of the EMVCo Secure Remote Commerce standard
              jointly supported by Visa, Mastercard, American Express, and
              Discover.
            </li>
            <li>
              Focus area is card-not-present checkout: services that enroll
              cardholders, return network-tokenized credentials instead of raw
              PANs, and provide a merchant-agnostic checkout solutions; across web, mobile, and in-app surfaces.
            </li>
          </ul>
        </div>

        <div className={styles.role}>
          <p className={styles.roleTitle}>
            Software Engineer — Walmart Global Tech
          </p>
          <p className={styles.roleMeta}>Oct 2021 – Jul 2022</p>
          <p className={styles.roleMeta}>
            Supply Chain Technology — Fulfillment Management Service (FMS)
          </p>
          <p className={styles.roleMeta}>
            Stack: Java · Spring Boot · Microservices · Kafka · Kubernetes ·
            Microsoft Azure
          </p>
          <ul className={styles.roleDetail}>
            <li>
              Contributed to backend services in Walmart&apos;s Fulfillment
              Management platform, which orchestrates how orders are routed
              and tracked across the store and fulfillment-center network.
            </li>
          </ul>
        </div>

        <div className={styles.role}>
          <p className={styles.roleTitle}>
            Software Engineer Intern — Mastercard
          </p>
          <p className={styles.roleMeta}>May 2021 – Aug 2021</p>
          <p className={styles.roleMeta}>
            Mastercard Digital Enablement Service (MDES)
          </p>
          <ul className={styles.roleDetail}>
            <li>
              Worked on MDES, Mastercard&apos;s tokenization platform that
              backs contactless and digital-wallet payments for products like
              Apple Pay, Google Pay, and Samsung Pay.
            </li>
          </ul>
        </div>

        <div className={styles.role}>
          <p className={styles.roleTitle}>Frontend Developer — HackRU</p>
          <p className={styles.roleMeta}>Jan 2020 – Jun 2021</p>
          <ul className={styles.roleDetail}>
            <li>
              Maintained hackru.org and shipped React features against APIs
              from partner teams, keeping the design language consistent for
              500+ students per hackathon.
            </li>
          </ul>
        </div>

        <div className={styles.role}>
          <p className={styles.roleTitle}>
            Team Captain, RUAutonomous — Rutgers AIAA
          </p>
          <p className={styles.roleMeta}>Jun 2020 – May 2021</p>
          <ul className={styles.roleDetail}>
            <li>
              Led the RUAutonomous competition team. On the AIAA executive
              board, helped steward $8,000+ of School of Engineering funding
              across four competition teams and 30+ engineering students.
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="edu-heading">
        <h2 id="edu-heading" className={styles.sectionTitle}>
          Education
        </h2>
        <div className={styles.edu}>
          <p className={styles.eduTitle}>
            Rutgers University – New Brunswick · B.A. Computer Science &amp; Psychology
          </p>
          <p className={styles.eduMeta}>Activities: AIAA / RUAutonomous, engineering &amp; CS student orgs</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="skills-heading">
        <h2 id="skills-heading" className={styles.sectionTitle}>
          Technical focus
        </h2>
        <ul className={styles.skills}>
          {site.skills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="honors-heading">
        <h2 id="honors-heading" className={styles.sectionTitle}>
          Honors
        </h2>
        <p className={styles.summary}>
          Eagle Scout, Boy Scouts of America (May 2017).
        </p>
      </section>
    </>
  );
}
