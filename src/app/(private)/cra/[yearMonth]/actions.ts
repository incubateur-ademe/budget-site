"use server";

import AirtableError from "airtable/lib/airtable_error";
import { format } from "date-fns";
import { partition } from "lodash";
import { headers } from "next/headers";

import { craTable } from "@/lib/airtable/client";
import { type CraDto } from "@/lib/dto";
import { auth } from "@/lib/next-auth/auth";
import { type ServerActionResponse } from "@/utils/next";

export const saveCRAs = async (
  cras: Array<Partial<CraDto>>,
  toDelete: string[],
): Promise<ServerActionResponse<void>> => {
  const session = await auth();
  if (!session) {
    return { ok: false, error: "Pas de session trouvée." };
  }

  const referer = headers().get("referer");

  if (!referer) {
    return { ok: false, error: "L'URL de référence est introuvable." };
  }

  const refererURL = new URL(referer);
  if (!/\/cra\/\d{4}-\d{2}/.test(refererURL.pathname)) {
    return { ok: false, error: "L'URL de référence est invalide." };
  }

  const yearMonth = refererURL.pathname.split("/").pop()!;
  const [year, month] = yearMonth.split("-");
  const yearMonthDate = new Date(parseInt(year), parseInt(month) - 1);

  const [updatedCRAs, createdCRAs] = partition(cras, ({ id }) => id);

  try {
    createdCRAs.length &&
      (await craTable.create(
        (createdCRAs as CraDto[]).map(cra => ({
          fields: {
            "Commentaire membre": cra.memberComment,
            "Date Mois": format(yearMonthDate, "yyyy-MM-dd"),
            "Jours travaillés": cra.workedDays,
            Membre: [session.user.id] as [string],
            Startup: [cra.startup] as [string],
            TJM: cra.tjm,
            Status: "À valider" as const,
          },
        })),
      ));
  } catch (error: unknown) {
    console.error("Error while creating CRAs", error);
    if (error instanceof AirtableError) {
      return {
        ok: false,
        error: `Erreur lors de la création ([${error.statusCode}][${error.error}] ${error.message}).`,
      };
    }

    return { ok: false, error: "Erreur inconnue lors de la création." };
  }

  try {
    updatedCRAs.length &&
      (await craTable.update(
        (updatedCRAs as CraDto[]).map(cra => ({
          id: cra.id,
          fields: {
            "Commentaire membre": cra.memberComment,
            "Jours travaillés": cra.workedDays,
            Startup: [cra.startup] as [string],
            TJM: cra.tjm,
            Status: "À valider" as const,
          },
        })),
      ));
  } catch (error: unknown) {
    console.error("Error while updating CRAs", error);
    if (error instanceof AirtableError) {
      return {
        ok: false,
        error: `Erreur lors de la mise à jour ([${error.statusCode}][${error.error}] ${error.message}).`,
      };
    }

    return { ok: false, error: "Erreur inconnue lors de la mise à jour." };
  }

  try {
    toDelete.length && (await craTable.destroy(toDelete));
  } catch (error: unknown) {
    console.error("Error while deleting CRAs", error);
    if (error instanceof AirtableError) {
      return {
        ok: false,
        error: `Erreur lors de la suppression ([${error.statusCode}][${error.error}] ${error.message}).`,
      };
    }

    return { ok: false, error: "Erreur inconnue lors de la suppression." };
  }

  return { ok: true };
};
