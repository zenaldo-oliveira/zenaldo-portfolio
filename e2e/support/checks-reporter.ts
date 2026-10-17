import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

// Soma as verificações registradas por cada teste (anotação "checks", via
// finish() em helpers.ts) e imprime o total da execução — para confirmar que
// todos os cenários das suítes continuam sendo executados.
export default class ChecksReporter implements Reporter {
  private executed = 0;
  private perFile = new Map<string, number>();

  onTestEnd(test: TestCase, result: TestResult) {
    const annotation = result.annotations.find((a) => a.type === "checks") ?? test.annotations.find((a) => a.type === "checks");
    const count = Number(annotation?.description ?? 0);
    this.executed += count;
    const file = test.location.file.split(/[\\/]/).pop() ?? test.location.file;
    this.perFile.set(file, (this.perFile.get(file) ?? 0) + count);
  }

  onEnd(result: FullResult) {
    const lines = [...this.perFile.entries()].sort().map(([file, n]) => `  ${file.padEnd(24)} ${n}`);
    console.log(`\nVerificações executadas: ${this.executed} (status: ${result.status})\n${lines.join("\n")}`);
  }

  printsToStdio() {
    return false;
  }
}
