import { readFileSync } from "fs";
import { exec } from "child_process";

// Função para executar o comando da CLI e retornar a saída
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

describe("CLI Simplify Tests", () => {
  // Carrega os casos de teste do arquivo JSON
  const testCases = JSON.parse(
    readFileSync(
      "C:/Users/natha/Documents/CLI/simplify/src/tests/testCases/commit.json",
      "utf8",
    ),
  ).testCases;

  testCases.forEach((testCase) => {
    it(testCase.scenario, async () => {
      // Se necessário, execute a configuração especificada
      if (testCase.setup) {
        await execCommand(testCase.setup);
      }

      // Executa o comando da CLI
      const output = await execCommand(testCase.command);

      // Verifica se a saída está de acordo com o esperado
      expect(output).toBe(testCase.expectedOutput);
    });
  });
});
