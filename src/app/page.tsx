import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type Metadata } from "next";

import { config } from "@/config";
import { Box, Container, Grid, GridCol } from "@/dsfr";
import { ImgHero } from "@/svg/ImgHero";

import { ErrorDisplay } from "./ErrorDisplay";
import styles from "./index.module.scss";
import { sharedMetadata } from "./shared-metadata";

const url = "/";

export const metadata: Metadata = {
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph,
    url,
  },
  alternates: {
    canonical: url,
  },
};

const Home = () => {
  if (config.env === "prod") {
    return <ErrorDisplay code="construction" noRedirect />;
  }

  return (
    <>
      <Box as="section" pb="4w" pt="9w" className={cx(styles.hero)}>
        <Container>
          <Grid haveGutters>
            <GridCol lg={7} className="fr-my-auto">
              <h1>{config.name}</h1>
              <p>{config.tagline}</p>
            </GridCol>
            <GridCol md={6} lg={5} className="fr-mx-auto">
              <ImgHero />
            </GridCol>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default Home;
