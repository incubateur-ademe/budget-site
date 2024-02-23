import { Box, Container, Grid, GridCol } from "@/dsfr";

import style from "../login.module.scss";

const VerifyRequestPage = () => (
  <Container ptmd="14v" mbmd="14v" fluid>
    <Grid haveGutters align="center">
      <GridCol md={8} lg={6}>
        <Container pxmd="0" py="10v" mymd="14v" className={style.login}>
          <Grid haveGutters align="center">
            <GridCol md={9} lg={8}>
              <h1>Connexion Budget Site</h1>
              <Box>
                <p>
                  Un email de vérification a été envoyé à l'adresse que vous avez renseignée. Veuillez vérifier votre
                  boîte mail et cliquer sur le lien pour valider votre adresse email.
                </p>
                <p>En cas d'adresse ADEME, vérifiez également les spams dans Mailinblack.</p>
              </Box>
            </GridCol>
          </Grid>
        </Container>
      </GridCol>
    </Grid>
  </Container>
);

export default VerifyRequestPage;
