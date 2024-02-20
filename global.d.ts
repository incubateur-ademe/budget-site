import { type StaticImageData } from "next/image";

declare module "@codegouvfr/react-dsfr/*.svg" {
  const content: StaticImageData;

  export = content;
}
