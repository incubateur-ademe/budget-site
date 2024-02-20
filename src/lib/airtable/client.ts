import Airtable from "airtable";

import { config } from "@/config";

export const airtable = new Airtable({
  apiKey: config.api.airtable.apiKey,
});
