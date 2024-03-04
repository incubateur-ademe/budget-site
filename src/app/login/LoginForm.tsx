"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";

import { Loader } from "@/components/utils/Loader";
import { FormFieldset } from "@/dsfr";

export const LoginForm = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    await signIn("nodemailer", {
      email: passwordRef.current?.value,
      callbackUrl: "/",
    });
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setIsLoading(true);
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
                    children: <Loader loading={isLoading} text="Se connecter" />,
                    type: "submit",
                    disabled: isLoading,
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
