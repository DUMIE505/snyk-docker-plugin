import { scan } from "../../../lib/index";
import { execute } from "../../../lib/sub-process";

describe("rpm package manager tests", () => {
  afterAll(async () => {
    await execute("docker", [
      "image",
      "rm",
      "amazonlinux:2.0.20200722.0",
    ]).catch();
  });

  it("should correctly analyze an rpm image", async () => {
    const image = "amazonlinux:2.0.20200722.0";
    const pluginResult = await scan({
      path: image,
    });

    expect(pluginResult).toMatchSnapshot();
  });
});
