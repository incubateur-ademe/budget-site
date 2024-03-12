"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Loader } from "@/components/utils/Loader";
import { Box, Grid, GridCol } from "@/dsfr";
import { CountDisplay } from "@/dsfr/base/CountDisplay";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { type CraDto } from "@/lib/dto";
import { type UserData } from "@/lib/next-auth/UserData";
import { useEffectOnce } from "@/utils/react";
import { tjmSchema } from "@/utils/zod-schema";

import { StatusBadge } from "../StatusBadge";
import { saveCRAs } from "./actions";
import style from "./YearMonth.module.scss";

export const craSchemaWithMax = (maxDays: number) =>
  z.object({
    cras: z
      .array(
        z.object({
          internalId: z.string().optional(),
          date: z.date().optional(),
          startup: z.string().min(1, "Une startup doit être sélectionnée."),
          tjm: tjmSchema,
          days: z
            .number({ invalid_type_error: "Le nombre de jours doit au moins être de 0." })
            .nonnegative("Le nombre de jours doit au moins être de 0.")
            .multipleOf(0.5, "Doit être un multiple de 0.5 car la découpe minimale des jours sont les demi journées.")
            .max(maxDays, `Ne peut être au dessus de ${maxDays} jours.`),
          memberComment: z.string().optional(),
        }),
      )
      .superRefine((value, ctx) => {
        for (let i = 0; i < value.length; i++) {
          const { days } = value[i];

          const totalDaysExceptCurrent = value.filter((_, j) => i !== j).reduce((acc, { days }) => acc + days, 0);
          if (totalDaysExceptCurrent + days > maxDays) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Ne peut être au dessus de ${maxDays - totalDaysExceptCurrent} jours car la somme des jours travaillés ne peut pas dépasser ${maxDays} jours.`,
              path: [i, "days"],
            });
          }
        }
      }),
  });

type FormType = z.infer<ReturnType<typeof craSchemaWithMax>>;

export interface CRAFormProps {
  currentCras: CraDto[];
  defaultTJM?: number;
  maxDays: number;
  startups: UserData["startups"];
}

export const CRAForm = ({ maxDays, startups, currentCras, defaultTJM }: CRAFormProps) => {
  const [editModes, setEditModes] = useState<boolean[]>([]);
  const [savePending, setSavePending] = useState(false);
  const [craToDelete, setCraToDelete] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, formState, watch, control, getValues, reset } = useForm<FormType>({
    resolver: zodResolver(craSchemaWithMax(maxDays)),
    mode: "onChange",
  });

  const {
    append: appendCRA,
    remove: removeCRA,
    fields: craFields,
    replace: replaceCRA,
  } = useFieldArray({
    control,
    name: "cras",
  });

  useEffectOnce(() => {
    const fieldLength = getValues().cras.length;
    if (currentCras.length && fieldLength === 0) {
      replaceCRA(
        currentCras.map(cra => ({
          startup: cra.startup,
          tjm: cra.tjm,
          days: cra.workedDays,
          memberComment: cra.memberComment,
          internalId: cra.id,
          date: cra.date,
        })),
      );
      setEditModes(currentCras.map(() => false));
    } else {
      appendCRA({ startup: startups[0].id, tjm: defaultTJM ?? 0, days: 0 });
      setEditModes([true]);
    }
    reset({}, { keepValues: true });
  }, [replaceCRA, currentCras, appendCRA, defaultTJM, startups, getValues, reset]);

  const watchedDays = startups.map((_, index) => watch(`cras.${index}.days`));

  const saveDisabled =
    !formState.isValid ||
    !formState.isDirty ||
    !craFields.length ||
    !!errorMessage ||
    savePending ||
    editModes.every(v => !v);

  const onSubmit = async (data: FormType) => {
    if (saveDisabled) return;
    setSavePending(true);
    const result = await saveCRAs(
      data.cras.map<Partial<CraDto>>(cra => {
        const currentCra = currentCras.find(c => c.id === cra.internalId);

        if (currentCra) {
          return {
            id: currentCra.id,
            workedDays: cra.days,
            memberComment: cra.memberComment,
            startup: cra.startup,
            tjm: cra.tjm,
          };
        }

        return {
          workedDays: cra.days,
          memberComment: cra.memberComment,
          startup: cra.startup,
          tjm: cra.tjm,
        };
      }),
      craToDelete,
    );
    setSavePending(false);

    if (result.ok) {
      router.push("/cra/declaration/confirmation");
    } else {
      setErrorMessage(result.error);
    }
  };

  const currentCount = watchedDays.reduce((acc, days) => acc + days || 0, 0);

  return (
    <form onSubmit={e => void handleSubmit(onSubmit)(e)} noValidate className={fr.cx("fr-mt-4w")}>
      <ClientAnimate>
        {craFields.map((craField, index) => {
          const alreadyEditedCra = currentCras.find(cra => cra.id === craField.internalId);

          if (alreadyEditedCra && !editModes[index]) {
            return (
              <Box key={craField.internalId} mt="4w">
                <Recap
                  cra={alreadyEditedCra}
                  index={index + 1}
                  maxDays={maxDays}
                  startup={startups.find(s => s.id === alreadyEditedCra.startup)!}
                  onClickEdit={() => {
                    setEditModes(editModes.map((mode, i) => (i === index ? true : mode)));
                  }}
                />
              </Box>
            );
          }

          let totalDaysExceptCurrent = watchedDays.reduce((acc, days, i) => (i !== index ? acc + days : acc), 0);
          totalDaysExceptCurrent = isNaN(totalDaysExceptCurrent) ? 0 : totalDaysExceptCurrent;

          const currentMaxDays = maxDays - totalDaysExceptCurrent;

          return (
            <Grid key={craField.id} haveGutters mt="4w">
              <GridCol>
                <h4 className={fr.cx("fr-mb-1w")}>
                  Startup {index + 1}{" "}
                  {index ? (
                    <Button
                      size="small"
                      type="button"
                      onClick={() => {
                        if (craField.internalId) {
                          setCraToDelete([...craToDelete, craField.internalId]);
                        }
                        removeCRA(index);
                        setEditModes(editModes.filter((_, i) => i !== index));
                      }}
                      priority="tertiary no outline"
                      style={{ verticalAlign: "bottom" }}
                    >
                      Supprimer
                    </Button>
                  ) : null}
                </h4>
                <hr className={fr.cx("fr-pb-1w")} />
              </GridCol>
              <GridCol offsetRightSm={6} sm={6}>
                <Select
                  label="Startup"
                  state={formState.errors.cras?.[index]?.startup && "error"}
                  stateRelatedMessage={formState.errors.cras?.[index]?.startup?.message}
                  nativeSelectProps={{
                    ...register(`cras.${index}.startup`),
                  }}
                >
                  {startups.map(startup => (
                    <option key={startup.id} value={startup.id}>
                      {startup.name}
                    </option>
                  ))}
                </Select>
              </GridCol>
              <GridCol offsetRightSm={6} sm={6}>
                <Input
                  label="Taux Journalier Moyen (TJM)"
                  state={formState.errors.cras?.[index]?.tjm && "error"}
                  stateRelatedMessage={formState.errors.cras?.[index]?.tjm?.message}
                  nativeInputProps={{
                    type: "number",
                    min: 0,
                    ...register(`cras.${index}.tjm`, {
                      valueAsNumber: true,
                    }),
                  }}
                />
              </GridCol>
              <GridCol offsetRightSm={6} sm={6}>
                <Input
                  label="Nombre de jours travaillés"
                  hintText={
                    <>
                      Maximum déclarable : <strong>{currentMaxDays}</strong> (jours fériés exclus) sur{" "}
                      <strong>{maxDays}</strong>
                    </>
                  }
                  state={formState.errors.cras?.[index]?.days && "error"}
                  stateRelatedMessage={formState.errors.cras?.[index]?.days?.message}
                  nativeInputProps={{
                    type: "number",
                    min: 0,
                    max: currentMaxDays,
                    step: 0.5,
                    ...register(`cras.${index}.days`, {
                      valueAsNumber: true,
                    }),
                  }}
                />
              </GridCol>
              <GridCol offsetRightSm={6} sm={6}>
                <Input
                  label="Ajouter un commentaire (optionnel)"
                  textArea
                  state={formState.errors.cras?.[index]?.memberComment && "error"}
                  stateRelatedMessage={formState.errors.cras?.[index]?.memberComment?.message}
                  nativeTextAreaProps={{
                    ...register(`cras.${index}.memberComment`),
                  }}
                />
              </GridCol>
            </Grid>
          );
        })}
      </ClientAnimate>
      {craFields.length < startups.length && (
        <p className={cx(fr.cx("fr-hr-or", "fr-mt-4w"), style["hr-add"])}>
          <Button
            type="button"
            iconId="fr-icon-add-circle-fill"
            priority="tertiary no outline"
            size="small"
            onClick={() => {
              appendCRA({
                // get the first startup that is not already in the form
                startup: startups.filter(s => !craFields.some(field => field.startup === s.id))[0].id,
                tjm: defaultTJM ?? 0,
                days: 0,
              });
              setEditModes([...editModes, true]);
            }}
          >
            Ajouter un CRA
          </Button>
        </p>
      )}
      <Grid haveGutters mt="2w">
        <GridCol offsetRightSm={4} sm={8}>
          <CountDisplay count={isNaN(currentCount) ? "-" : currentCount} max={maxDays} text="Jours déclarés ce mois" />
        </GridCol>
      </Grid>
      <ClientAnimate>
        {errorMessage && <Alert severity="error" title="Erreur" description={errorMessage} />}
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttonsEquisized
          className={fr.cx("fr-mt-4w")}
          buttons={[
            {
              children: "Revenir à la liste",
              iconId: "fr-icon-arrow-left-line",
              iconPosition: "left",
              priority: "secondary",
              linkProps: {
                href: "/cra/declaration",
              },
            },
            {
              type: "submit",
              children: <Loader loading={savePending} text="Déclarer mes temps" />,
              priority: "primary",
              disabled: saveDisabled,
            },
          ]}
        />
      </ClientAnimate>
    </form>
  );
};

interface RecapProps {
  cra: CraDto;
  index: number;
  maxDays: number;
  onClickEdit: () => void;
  startup: UserData["startups"][number];
}

const Recap = ({ cra, maxDays, index, startup, onClickEdit: onClick }: RecapProps) => {
  const s = cra.workedDays > 1 ? "s" : "";
  return (
    <RecapCard
      title={
        <>
          Startup {index} <StatusBadge status={cra.status} className={fr.cx("fr-ml-2v")} />
        </>
      }
      sideButtonProps={{
        title: "Modifier",
        iconId: "fr-icon-edit-line",
        priority: "tertiary no outline",
        style: { alignSelf: "center" },
        type: "button",
        onClick,
      }}
      content={
        <>
          {startup.name}
          <br />
          {cra.tjm} € / jour
          <br />
          <strong>{cra.workedDays}</strong> jour{s} facturé{s} sur {maxDays} jours ouvrés
          {cra.memberComment && (
            <>
              <br />
              <p
                className={fr.cx("fr-icon-quote-fill", "fr-mt-2w")}
                style={{ color: fr.colors.decisions.text.actionHigh.blueFrance.default }}
              >
                <br />
                <em
                  className={fr.cx("fr-mt-1w", "fr-ml-2w")}
                  style={{ color: fr.colors.decisions.text.mention.grey.default }}
                >
                  "{cra.memberComment}"
                </em>
              </p>
            </>
          )}
        </>
      }
    />
  );
};
