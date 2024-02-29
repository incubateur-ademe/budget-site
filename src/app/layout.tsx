import "./global.css";
import "react-loading-skeleton/dist/skeleton.css";

import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Header, type HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { type PropsWithChildren } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import { Brand } from "@/components/Brand";
import { config } from "@/config";

import { FooterPersonalDataPolicyItem } from "../consentManagement";
import { defaultColorScheme } from "../defaultColorScheme";
import { StartDsfr } from "../StartDsfr";
import { LoginLogoutHeaderItem, UserHeaderItem } from "./AuthHeaderItems";
import { Navigation } from "./Navigation";
import styles from "./root.module.scss";
import { sharedMetadata } from "./shared-metadata";

const contentId = "content";
const footerId = "footer";

const operatorLogo: HeaderProps["operatorLogo"] = {
  imgUrl: "/img/ademe-incubateur-logo.png",
  alt: "Accélérateur de la Transition Écologique",
  orientation: "vertical",
};

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  ...sharedMetadata,
  title: {
    template: `${config.name} - %s`,
    default: config.name,
  },
  openGraph: {
    title: {
      template: `${config.name} - %s`,
      default: config.name,
    },
    ...sharedMetadata.openGraph,
  },
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html
      lang="fr"
      {...getHtmlAttributes({ defaultColorScheme, lang: "fr" })}
      className={cx(GeistSans.variable, styles.app)}
    >
      <head>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            "Marianne-Light",
            "Marianne-Light_Italic",
            "Marianne-Regular",
            "Marianne-Regular_Italic",
            "Marianne-Medium",
            "Marianne-Medium_Italic",
            "Marianne-Bold",
            "Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
          doDisableFavicon
        />
      </head>
      <body>
        <SessionProvider refetchOnWindowFocus>
          <DsfrProvider lang="fr">
            <SkeletonTheme
              baseColor={fr.colors.decisions.background.contrast.grey.default}
              highlightColor={fr.colors.decisions.background.contrast.grey.active}
              borderRadius={fr.spacing("1v")}
              duration={2}
            >
              {/* <ConsentBannerAndConsentManagement /> */}
              <SkipLinks
                links={[
                  {
                    anchor: `#${contentId}`,
                    label: "Contenu",
                  },
                  {
                    anchor: `#${footerId}`,
                    label: "Pied de page",
                  },
                ]}
              />
              <div className={styles.app}>
                <Header
                  navigation={<Navigation />}
                  brandTop={<Brand />}
                  homeLinkProps={{
                    href: "/",
                    title: `Accueil - ${config.name}`,
                  }}
                  serviceTitle={
                    <>
                      {config.name}
                      &nbsp;
                      <Badge as="span" noIcon severity="success">
                        Beta
                      </Badge>
                    </>
                  }
                  serviceTagline={config.tagline}
                  operatorLogo={operatorLogo}
                  classes={{
                    operator: "shimmer",
                  }}
                  quickAccessItems={[
                    <UserHeaderItem key="hqai-user" />,
                    <LoginLogoutHeaderItem key="hqai-loginlogout" />,
                  ].filter(Boolean)}
                />
                <main role="main" id={contentId} className={styles.content}>
                  {children}
                </main>
                <Footer
                  id={footerId}
                  accessibility="non compliant"
                  accessibilityLinkProps={{ href: "/accessibilite" }}
                  contentDescription={`${config.name} est un service développé par l'accélérateur de la transition écologique de l'ADEME.`}
                  operatorLogo={operatorLogo}
                  partnersLogos={{
                    main: {
                      imgUrl: "/img/ademe-logo-2022-1.svg",
                      alt: "ADEME",
                      linkProps: {
                        href: "https://www.ademe.fr/",
                        title: "Agence de la transition écologique",
                        className: fr.cx("fr-raw-link"),
                      },
                    },
                  }}
                  bottomItems={[
                    {
                      text: "CGU",
                      linkProps: { href: "/cgu" },
                    },
                    <FooterPersonalDataPolicyItem key="FooterPersonalDataPolicyItem" />,
                    {
                      ...headerFooterDisplayItem,
                      iconId: "fr-icon-theme-fill",
                    },
                    // <FooterConsentManagementItem key="FooterConsentManagementItem" />,
                    {
                      text: <>▲&nbsp;Propulsé par Vercel</>,
                      linkProps: {
                        href: "https://vercel.com/?utm_source=ademe&utm_campaign=oss",
                        className: "font-geist-sans",
                      },
                    },
                    {
                      text: `Version ${config.appVersion}.${config.appVersionCommit.slice(0, 7)}`,
                      linkProps: {
                        href: `${config.repositoryUrl}/commit/${config.appVersionCommit}` as never,
                      },
                    },
                  ]}
                  termsLinkProps={{ href: "/mentions-legales" }}
                  license={
                    <>
                      Sauf mention contraire, tous les contenus de ce site sont sous{" "}
                      <a href={`${config.repositoryUrl}/main/LICENSE`} target="_blank" rel="noreferrer">
                        licence Apache 2.0
                      </a>
                    </>
                  }
                />
              </div>
            </SkeletonTheme>
          </DsfrProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
