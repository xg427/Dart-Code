import * as assert from "assert";
import { OpenFileTracker } from "../../../src/analysis/open_file_tracker";
import { TestOutlineVisitor } from "../../../src/utils/vscode/outline";
import { activate, getPackages, helloWorldTestMainFile, waitForResult } from "../../helpers";

describe("test_outline_visitor", () => {

	before("get packages", () => getPackages());
	beforeEach("activate and wait for outline", async () => {
		await activate(helloWorldTestMainFile);
		await waitForResult(() => !!OpenFileTracker.getOutlineFor(helloWorldTestMainFile));
	});

	it("reads the correct groups and tests", () => {
		const outline = OpenFileTracker.getOutlineFor(helloWorldTestMainFile);

		const visitor = new TestOutlineVisitor();
		visitor.visit(outline);

		assert.equal(visitor.tests.length, 7);
		assert.equal(visitor.tests[0].isGroup, true);
		assert.equal(visitor.tests[0].fullName, "String");
		assert.equal(visitor.tests[1].isGroup, false);
		assert.equal(visitor.tests[1].fullName, "String .split() splits the string on the delimiter");
		assert.equal(visitor.tests[2].isGroup, false);
		assert.equal(visitor.tests[2].fullName, "String .split() splits the string on the delimiter 2");
		assert.equal(visitor.tests[3].isGroup, false);
		assert.equal(visitor.tests[3].fullName, "String .trim() removes surrounding whitespace");

		assert.equal(visitor.tests[4].isGroup, true);
		assert.equal(visitor.tests[4].fullName, "int");
		assert.equal(visitor.tests[5].isGroup, false);
		assert.equal(visitor.tests[5].fullName, "int .remainder() returns the remainder of division");
		assert.equal(visitor.tests[6].isGroup, false);
		assert.equal(visitor.tests[6].fullName, "int .toRadixString() returns a hex string");
	});
});
