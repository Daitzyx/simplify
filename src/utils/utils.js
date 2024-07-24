import dns from "dns";
import util from "util";

export const checkInternetConnection = async () => {
  const lookup = util.promisify(dns.lookup);
  try {
    await lookup("google.com");

    return true;
  } catch (error) {
    return false;
  }
};
