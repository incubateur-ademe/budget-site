"use client";

import { fr } from "@codegouvfr/react-dsfr";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Container, Grid, GridCol } from "@/dsfr";
import { type UserData } from "@/lib/next-auth/UserData";
import { percentageSchema, tjmSchema } from "@/utils/zod-schema";

const missionSchema = z
  .object({
    tjm: tjmSchema,
    startup: z.string().min(1, "Une startup doit être sélectionnée."),
    spanTime: percentageSchema.multipleOf(10, "La durée doit être un multiple de 10."),
    startDate: z.date(),
    endDate: z.date(),
  })
  .superRefine((value, ctx) => {
    if (value.startDate > value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de début doit être antérieure à la date de fin.",
        path: ["startDate"],
      });
    }
  });

type FormType = z.infer<typeof missionSchema>;

export interface NewMissionFormProps {
  className?: CxArg;
  user: UserData;
}

export const NewMissionForm = ({ user, className }: NewMissionFormProps) => {
  const { register, handleSubmit, formState } = useForm<FormType>({
    resolver: zodResolver(missionSchema),
    mode: "onChange",
  });

  if (user.type === "Gestionnaire") {
    return null;
  }

  const isIntra = user.type === "Intra";

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <Container as="section" fluid className={cx(className, "flex flex-col")}>
      <form onSubmit={e => void handleSubmit(onSubmit)(e)} noValidate className="h-full flex-1 flex flex-col">
        <Container className="flex-1">
          <Grid haveGutters>
            <GridCol offsetRightXl={4} xl={8}>
              <Select
                label="Startup"
                state={formState.errors.startup && "error"}
                stateRelatedMessage={formState.errors?.startup?.message}
                nativeSelectProps={{
                  ...register("startup"),
                }}
              >
                {user.startups.map(startup => (
                  <option key={startup.id} value={startup.id}>
                    {startup.name}
                  </option>
                ))}
              </Select>
            </GridCol>
            <GridCol offsetRightXl={4} xl={8}>
              <Input
                label="Taux Journalier Moyen (TJM)"
                state={formState.errors?.tjm && "error"}
                stateRelatedMessage={formState.errors?.tjm?.message}
                nativeInputProps={{
                  type: "number",
                  min: 0,
                  ...register("tjm", {
                    valueAsNumber: true,
                  }),
                }}
              />
            </GridCol>
            <GridCol offsetRightXl={4} xl={8}>
              <Input
                label="Temps passé en %"
                hintText={
                  <>
                    Pourcentage passé par semaine sur la mission.
                    <br />
                    (90% = 4,5/5, 80% = 4/5, ...)
                  </>
                }
                addon={
                  <input
                    className={fr.cx("fr-input")}
                    defaultValue="%"
                    readOnly
                    disabled
                    style={{
                      maxWidth: "5ch",
                    }}
                  />
                }
                nativeInputProps={{
                  type: "number",
                  min: 0,
                  max: 100,
                  step: 10,
                  ...register("spanTime", {
                    valueAsNumber: true,
                  }),
                }}
              />
            </GridCol>
          </Grid>
        </Container>
        <Container
          fluid
          as="footer"
          className={cx("flex-none", fr.cx("fr-hr", "fr-pb-0"))}
          style={{
            background: "var(--background-contrast-grey)",
          }}
        >
          <Grid valign="middle" className={fr.cx("fr-p-2w", "fr-py-4w")}>
            <GridCol>
              <ButtonsGroup
                buttonsEquisized
                alignment="right"
                inlineLayoutWhen="always"
                buttons={[
                  {
                    type: "button",
                    children: "Annuler",
                    onClick: () => console.log("Annuler"),
                    priority: "secondary",
                  },
                  {
                    type: "submit",
                    children: "Valider",
                    priority: "primary",
                  },
                ]}
              />
            </GridCol>
          </Grid>
        </Container>
      </form>
    </Container>
  );
};
