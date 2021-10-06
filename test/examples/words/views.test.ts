import path from "path";
import nano from "nano";
import { Word } from "./types";
import { WORDS } from "./data";
import { DesignDoc } from "../../../src/types";
import { transpileViewFunction } from "../../../src";

const DB_NAME = "words";
const DESIGN_DOC_ID = "_design/main";

describe("Views index inserted words", () => {
  const session = nano("http://couchpotato:sofachip@localhost:5984");
  type Doc = Word | DesignDoc;
  let db: nano.DocumentScope<Doc>;

  beforeAll(async () => {
    try {
      await session.db.destroy(DB_NAME);
    } catch (error) {}
    await session.db.create(DB_NAME);
    db = session.use<Doc>(DB_NAME);

    // POPULATE WITH DESIGN DOCUMENT
    await db.insert({
      _id: DESIGN_DOC_ID,
      views: {
        prefix: {
          map: await transpileViewFunction(
            path.resolve(__dirname, "./views/prefix/map.ts")
          ),
          reduce: await transpileViewFunction(
            path.resolve(__dirname, "./views/prefix/reduce.ts")
          )
        },
        substring: {
          map: await transpileViewFunction(
            path.resolve(__dirname, "./views/substring/map.ts")
          )
        }
      }
    });

    // POPULATE WITH DATA
    for (const word of WORDS) {
      await db.insert({
        _id: word,
        type: "word"
      });
    }
  }, 15000);

  afterAll(async () => {
    await session.db.destroy(DB_NAME);
  }, 15000);

  describe("prefix View", () => {
    test("Prefixes are emitted by map", async () => {
      const reduce = false;
      const { rows, total_rows } = await db.view("main", "prefix", {
        reduce
      });
      expect(total_rows).toBe(15);
      expect(rows.map(({ id, key }) => [key, id])).toMatchObject([
        ["a", "ace"],
        ["a", "act"],
        ["a", "add"],
        ["a", "ado"],
        ["a", "ads"],
        ["ac", "ace"],
        ["ac", "act"],
        ["ace", "ace"],
        ["act", "act"],
        ["ad", "add"],
        ["ad", "ado"],
        ["ad", "ads"],
        ["add", "add"],
        ["ado", "ado"],
        ["ads", "ads"]
      ]);
    });

    test("Prefixes are counted by map/reduce", async () => {
      const reduce = true;
      const group = true;
      const results = await db.view("main", "prefix", {
        reduce,
        group
      });
      expect(results).toMatchObject({
        rows: [
          { key: "a", value: 5 },
          { key: "ac", value: 2 },
          { key: "ace", value: 1 },
          { key: "act", value: 1 },
          { key: "ad", value: 3 },
          { key: "add", value: 1 },
          { key: "ado", value: 1 },
          { key: "ads", value: 1 }
        ]
      });
    });
  });

  describe("substring View", () => {
    test("All substrings are listed in view", async () => {
      // list view
    });
  });
});
