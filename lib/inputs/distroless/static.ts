import * as minimatch from "minimatch";

import { ExtractAction, ExtractedLayers } from "../../extractor/types";
import { streamToString } from "../../stream-utils";

export const getDpkgPackageFileContentAction: ExtractAction = {
  actionName: "dpkg",
  filePathMatches: (filePath) =>
    minimatch(filePath, "/var/lib/dpkg/status.d/*", { dot: true }),
  callback: streamToString, // TODO replace with a parser for apt data extractor
};

export function getAptFiles(extractedLayers: ExtractedLayers): string[] {
  const files: string[] = [];

  for (const fileName of Object.keys(extractedLayers)) {
    if (!("dpkg" in extractedLayers[fileName])) {
      continue;
    }
    files.push(extractedLayers[fileName].dpkg.toString("utf8"));
  }

  return files;
}
