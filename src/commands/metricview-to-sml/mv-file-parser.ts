import { Logger } from "../../shared/logger";
import fs from "fs/promises";
import { parseYaml } from "../../shared/yaml-parser";
import { MvModel } from "./mv-model";

// import { BimRoot } from "./bim-models/bim-model";

export class MvFileParser {
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
  }
  static create(logger: Logger) {
    return new MvFileParser(logger);
  }

  parse(jsonContent: string): MvModel {
    // const result = JSON.parse(jsonContent) as BimRoot;
    const result = parseYaml(jsonContent) as MvModel;

    // perform checks
    // this.validateBIM(result);

    return result;
  }

  async parseFile(filePath: string): Promise<MvModel> {
    const fileStringContent = await fs.readFile(filePath, "utf-8");
    return this.parse(fileStringContent);
  }

  validateBIM(bim: unknown) {
    // if (!bim || !bim.name) {
    //   this.logger.error(
    //     `BIM project is not formed correctly or is missing its name`,
    //   );
    //   throw new Error(`bim project missing name or malformed`);
    // }
    // if (!bim.model || !bim.model.tables || bim.model.tables.length === 0) {
    //   this.logger.error(`BIM project is missing a model or tables`);
    //   throw new Error(`model or tables missing from bim project`);
    // }
  }
}
