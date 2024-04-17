import fs from "fs";
import { dirname, join } from "path";
import config from "../config.json";

export class Config {
  //extends Object
  constructor() {
    // super();
    for (let [k, v] of Object.entries(config)) this[k] = v;
  }
  [k: string]: any;

  save() {
    fs.writeFileSync(
      join(dirname(__dirname), "config.json"),
      JSON.stringify(this)
    );
  }

  delete(...keys: string[]) {
    keys.map((key) => delete this[key]);
    return this.save();
  }
}
