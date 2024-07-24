import dns from "dns";
import { checkInternetConnection } from "../utils/utils.js";

jest.mock("dns");

describe("checkInternetConnection", () => {
  it("deve retornar verdadeiro se a conexão com a internet estiver disponível", async () => {
    dns.lookup.mockImplementation((hostname, callback) => {
      callback(null, "8.8.8.8");
    });

    const result = await checkInternetConnection();

    expect(result).toBe(true);
    expect(dns.lookup).toHaveBeenCalledWith("google.com", expect.any(Function));
  });

  it("deve retornar falso se a conexão com a internet não estiver disponível", async () => {
    dns.lookup.mockImplementation((hostname, callback) => {
      callback(new Error("DNS lookup failed"), null);
    });

    const result = await checkInternetConnection();

    expect(result).toBe(false);
    expect(dns.lookup).toHaveBeenCalledWith("google.com", expect.any(Function));
  });
});
