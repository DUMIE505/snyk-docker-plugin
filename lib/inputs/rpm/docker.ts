import { Docker, DockerOptions } from "../../docker";

export function getRpmDbFileContent(
  targetImage: string,
  options?: DockerOptions,
): Promise<string> {
  return new Docker(targetImage, options)
    .run("rpm", [
      "--nodigest",
      "--nosignature",
      "-qa",
      "--qf",
      '"%{NAME}\t%|EPOCH?{%{EPOCH}:}|%{VERSION}-%{RELEASE}\t%{SIZE}\n"',
    ])
    .catch((error) => {
      const stderr = error.stderr;
      // allowing failure if rpm is not installed
      if (typeof stderr === "string" && stderr.indexOf("not found") >= 0) {
        return { stdout: "", stderr: "" };
      }

      if (
        typeof stderr === "string" &&
        stderr.toLowerCase().indexOf("no such") >= 0
      ) {
        return { stdout: "", stderr: "" };
      }
      // allowing failure if analysing BusyBox
      if (
        typeof stderr === "string" &&
        stderr.indexOf("invalid option -- -") >= 0 &&
        stderr.indexOf("multi-call binary") >= 0 &&
        stderr.indexOf("BusyBox") >= 0
      ) {
        return { stdout: "", stderr: "" };
      }
      throw error;
    })
    .then((output) => output.stdout);
}
