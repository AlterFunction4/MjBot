import fs from "fs";

export class JSONCache extends Array<[string, any]> {
  constructor(private readonly _dir: string) {
    super();
    const json = JSON.parse(fs.readFileSync(_dir).toString());
    for (let k in json) {
      this.push([k, json[k]]);
    }
    this.save();
  }

  save() {
    fs.writeFileSync(
      this._dir,
      JSON.stringify(Object.fromEntries(this), (key, value) =>
        key === "_dir" ? undefined : value
      )
    );
  }

  add(tuple: [string, any]) {
    this.push(tuple);
    return this.save();
  }

  edit(key: string, value: any) {
    // this.find(([k]) => key === k);
  }
}
