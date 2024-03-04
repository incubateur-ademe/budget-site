import Badge, { type BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";

import { type CraDto } from "@/lib/dto";

export interface StatusBadgeProps {
  className?: CxArg;
  status: CraDto["status"];
}

const statusToBadge: Record<CraDto["status"], BadgeProps["severity"]> = {
  "À compléter": "info",
  Validé: "success",
  "À valider": "warning",
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
