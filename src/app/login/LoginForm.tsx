"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { signIn } from "next-auth/react";
import { useRef } from "react";

import { FormFieldset } from "@/dsfr";

export const LoginForm = () => {
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    await signIn("nodemailer", {
      email: passwordRef.current?.value,
      callbackUrl: "/",
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        void onSubmit();
      }}
    >
      <FormFieldset
        legend={<h2>Se connecter avec son email</h2>}
        elements={[
          <Input
            key="email"
            label="Identifiant"
            hintText={
              <>
                Adresse <code>@beta.gouv.fr</code> ou <code>@ademe.fr</code>. Pour les membres, il s'agit de l'adresse
                enregistrée dans la liste des membres sur Notion.
              </>
            }
            nativeInputProps={{
              type: "email",
              required: true,
              ref: passwordRef,
            }}
          />,
          <FormFieldset
            key="submit"
            legend={null}
            elements={[
              <ButtonsGroup
                key="buttons-group"
                buttons={[
                  {
                    children: "Se connecter",
                    type: "submit",
                  },
                ]}
              />,
            ]}
          />,
        ]}
      />
    </form>
  );
};
