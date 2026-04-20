import type { CommandDef } from "@/lib/shell/types";

export const slCmd: CommandDef = {
  name: "sl",
  category: "fun",
  hidden: true,
  summary: "A tiny train rolls by",
  usage: "sl",
  run(_argv, opts) {
    if (opts.help) {
      return {
        stdout: ["usage: sl"],
        stderr: [],
        exitCode: 0,
      };
    }

    return {
      stdout: [
        "      ====        ________                ___________ ",
        "  _D _|  |_______/        \\__I_I_____===__|_________|",
        "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
        "   /     |  |   H  |  |     |   |         ||_| |_||  ",
        "  |      |  |   H  |__--------------------| [___] |  ",
        "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
        "  |/ |   |-----------I_____I [][] []  D   |=======|__",
        "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
        " |/-=|___|=O=====O=====O=====O   |_____/~\\___/       ",
        "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/           ",
      ],
      stderr: [],
      exitCode: 0,
    };
  },
};
