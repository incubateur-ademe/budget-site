import { cx } from "@codegouvfr/react-dsfr/tools/cx";

export const ImgHero = () => (
  <svg className={cx("dsfr-svg", "fr-fluid-img")} width={500} height={500}>
    <use href="img/hero.svg#freepik_stories-audit"></use>
  </svg>
);
