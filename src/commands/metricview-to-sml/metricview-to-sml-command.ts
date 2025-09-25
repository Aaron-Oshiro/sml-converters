import { Flags, Command } from "@oclif/core";
import { CommandLogger } from "../../shared/command-logger";
import { SmlResultWriter } from "../../shared/sml-result-writer";
import { parseInputFile, convertInput } from "../../shared/file-system-util";
import {
  logSmlConverterResult,
} from "../../shared/sml-convert-result";
import { MvFileParser } from "./mv-file-parser";
import { MvToSMLConverter } from "./mv-converter/mv-to-sml-converter";

export class MetricViewToSmlCommand extends Command {
  static summary = "Converts a Power BI Model to SML";
  static description = ` `;

  static flags = {
    source: Flags.directory({
      description: "Source folder",
      default: "./",
      required: false,
      aliases: ["s"],
    }),
    output: Flags.directory({
      description: "Output folder",
      required: false,
      default: "./bim_output",
      aliases: ["o"],
    }),
    clean: Flags.boolean({
      description: "Clean the output folder contents without the .git folder",
      required: false,
      default: false,
    }),
    atscaleConnectionId: Flags.string({
      description:
        "AtScale connection id. The connection id of the data warehouse in AtScale.",
      required: false,
      default: "con1",
    }),
  };

  static examples = [
    "<%= config.bin %> <%= command.id %>",
    "<%= config.bin %> <%= command.id %> --clean",
    "<%= config.bin %> <%= command.id %> --source=./bim-source-path --output=./sml-output-path",
    "<%= config.bin %> <%= command.id %> -s ./bim-source-path -o ./sml-output-path",
    "<%= config.bin %> <%= command.id %> -s ./bim-source-path -o ./sml-output-path --clean",
    "<%= config.bin %> <%= command.id %> -s ./bim-source-path -o ./sml-output-path --atscaleConnectionId=con1 --clean",
  ];

  async run() {
    const { flags } = await this.parse(MetricViewToSmlCommand);
    await this.convert({
      sourcePath: flags.source,
      outputPath: flags.output,
      clean: flags.clean,
      atscaleConnectionId: flags.atscaleConnectionId,
    });
  }

  protected async convert(
    input: convertInput & { atscaleConnectionId: string },
  ) {
    const logger = CommandLogger.for(this);
    const { absoluteOutputPath, absoluteSourcePath } = await parseInputFile(
      input,
      logger,
      this,
    );

    logger.info(`Reading Metric View from ${absoluteSourcePath}`);

    const mvParsedFile = await MvFileParser.create(logger).parseFile(
      absoluteSourcePath,
    );

    logger.info(`Metric View files are parsed.`);


    const mvConverter = new MvToSMLConverter(logger);
    const smlResult = await mvConverter.convert(
      mvParsedFile,
      input.atscaleConnectionId,
    );

    logger.info(`SML objects are prepared`);
    // await SmlResultWriter.create(logger).persist(absoluteOutputPath, smlResult);

    logger.info(`SML file persisted at ${absoluteOutputPath}`);
    logSmlConverterResult(smlResult, logger);
  }
}
