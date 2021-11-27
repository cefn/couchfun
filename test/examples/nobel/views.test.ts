import path from "path";
import nano from "nano";
import { PrizeRecord } from "./types";
import { PRIZES } from "./data";
import { DesignDoc, Immutable } from "../../../src/types";
import { transpileViewFunction } from "../../../src";

const DB_NAME = "prizes";
const DESIGN_DOC_ID = "_design/main";

describe("Views index inserted words", () => {
  const session = nano("http://couchpotato:sofachip@localhost:5984");
  type Doc = Immutable<PrizeRecord> | DesignDoc;
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
        cloud: {
          map: await transpileViewFunction(
            path.resolve(__dirname, "./views/cloud/map.ts")
          ),
          reduce: await transpileViewFunction(
            path.resolve(__dirname, "./views/cloud/reduce.ts")
          )
        }
      }
    });

    // POPULATE WITH DATA
    for (const prize of PRIZES) {
      const { year, category } = prize;
      await db.insert({
        _id: `${year}${category}`,
        ...prize
      });
    }
  }, 120000);

  afterAll(async () => {
    await session.db.destroy(DB_NAME);
  }, 15000);

  describe("prefix View", () => {
    test("Terms are emitted by map", async () => {
      const result = await db.view("main", "cloud", {
        reduce: false
      });
      const { rows, total_rows } = result;
      expect(total_rows).toMatchInlineSnapshot();
      expect(
        rows.map(({ id, key }) => [key, id]).slice(0, 10)
      ).toMatchInlineSnapshot();
    }, 60000);

    test("Terms are counted by map/reduce", async () => {
      const reduce = true;
      const group = true;
      const results = await db.view("main", "cloud", {
        reduce,
        group
      });
      expect(results.rows.length).toEqual(2688);
      expect(results.rows.slice(0, 10)).toMatchInlineSnapshot();
    }, 60000);
  });

  describe("substring View", () => {
    test("All substrings are listed in view", async () => {
      // list view
    });
  });
});
