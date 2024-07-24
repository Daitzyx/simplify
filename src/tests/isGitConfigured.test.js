import { execSync } from "child_process";
import { isGitUserConfigured } from "../../src/utils/gitUtils.js";

jest.mock("child_process");

describe("isGitUserConfigured", () => {
  it("should return true if user.name and user.email are configured", () => {
    execSync
      .mockReturnValueOnce("Test User")
      .mockReturnValueOnce("test@example.com");

    const result = isGitUserConfigured();

    expect(result).toBe(true);
    expect(execSync).toHaveBeenCalledWith("git config user.name", {
      stdio: "pipe",
    });
    expect(execSync).toHaveBeenCalledWith("git config user.email", {
      stdio: "pipe",
    });
  });

  it("should return false if user.name is not configured", () => {
    execSync.mockReturnValueOnce("").mockReturnValueOnce("test@example.com");

    const result = isGitUserConfigured();

    expect(result).toBe(false);
    expect(execSync).toHaveBeenCalledWith("git config user.name", {
      stdio: "pipe",
    });
    expect(execSync).toHaveBeenCalledWith("git config user.email", {
      stdio: "pipe",
    });
  });

  it("should return false if user.email is not configured", () => {
    execSync.mockReturnValueOnce("Test User").mockReturnValueOnce("");

    const result = isGitUserConfigured();

    expect(result).toBe(false);
    expect(execSync).toHaveBeenCalledWith("git config user.name", {
      stdio: "pipe",
    });
    expect(execSync).toHaveBeenCalledWith("git config user.email", {
      stdio: "pipe",
    });
  });

  it("should return false if the git commands fail", () => {
    execSync.mockImplementation(() => {
      throw new Error("Command failed");
    });

    const result = isGitUserConfigured();

    expect(result).toBe(false);
    expect(execSync).toHaveBeenCalledWith("git config user.name", {
      stdio: "pipe",
    });
    expect(execSync).toHaveBeenCalledWith("git config user.email", {
      stdio: "pipe",
    });
  });
});
