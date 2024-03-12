import Badge, { type BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";

import { type CraDto } from "@/lib/dto";

type ExtendedStatus = CraDto["status"] | "Mission manquante";

export interface StatusBadgeProps {
  className?: CxArg;
  status: ExtendedStatus;
}

const statusToBadge: Record<ExtendedStatus, BadgeProps["severity"]> = {
  "À compléter": "info",
  Validé: "success",
  "À valider": "warning",
  "Mission manquante": "error",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge
      small
      noIcon
      severity={statusToBadge[status]}
      style={{ verticalAlign: "middle", marginTop: "-2px" }}
      as="span"
      className={cx(className)}
    >
      {status}
    </Badge>
  );
};
