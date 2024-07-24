import { execSync } from "child_process";
import { checkRemoteRepositoryExists } from "../utils/gitUtils.js";

jest.mock("child_process");

describe("checkRemoteRepositoryExists", () => {
  it("should return true if a remote repository is connected", () => {
    execSync.mockReturnValue("origin");

    const result = checkRemoteRepositoryExists();

    expect(result).toBe(true);
    expect(execSync).toHaveBeenCalledWith("git remote", { stdio: "pipe" });
  });

  it("should return false if no remote repository is connected", () => {
    execSync.mockReturnValue("");

    const result = checkRemoteRepositoryExists();

    expect(result).toBe(false);
    expect(execSync).toHaveBeenCalledWith("git remote", { stdio: "pipe" });
  });

  it("should return false if the git command fails", () => {
    execSync.mockImplementation(() => {
      throw new Error("Command failed");
    });

    const result = checkRemoteRepositoryExists();

    expect(result).toBe(false);
    expect(execSync).toHaveBeenCalledWith("git remote", { stdio: "pipe" });
  });
});
