import * as constants from "@/constant/Index";

describe("Environment Constants", () => {
  it("should have defined environment variables", () => {
    expect(constants.API_URL).toBeDefined();
    expect(constants.CLIENT_ID).toBeDefined();
    expect(constants.SECRET_KEY).toBeDefined();
    expect(constants.BACKEND_BASE_URL).toBeDefined();
    expect(constants.ACCESS_TOKEN).toBeDefined();
  });
});
