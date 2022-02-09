import { expect } from "chai";
import Dotenv from "dotenv";
import "mocha";
import Leetcode from "../src";
import Problem from "../src/lib/problem";
import Submission from "../src/lib/submission";
import Helper from "../src/utils/helper";
import {
    EndPoint,
    LangSlug,
    ProblemDifficulty,
    ProblemStatus,
} from "../src/utils/interfaces";

describe("# Problem", async function () {
    const problem: Problem = new Problem("add-two-numbers");

    before(async () => {
        Dotenv.config();

        const props = (() => {
            if (process.env?.LEETCODE_COOKIE) {
                return {
                    cookie: process.env.LEETCODE_COOKIE,
                };
            } else {
                return {
                    username: process.env.LEETCODE_USERNAME || "",
                    password: process.env.LEETCODE_PASSWORD || "",
                };
            }
        })();

        await Leetcode.build(
            process.env.LEETCODE_ENDPOINT === "CN" ? EndPoint.CN : EndPoint.US,
            props
        );

        await problem.detail();
    });

    it("Should be instance of Problem", () => {
        expect(problem).to.instanceOf(Problem);
    });

    it("Should contain base field", () => {
        expect(problem.id).to.be.a("number");
        expect(problem.title).to.be.a("string");
        expect(problem.content).to.be.a("string");
        expect(problem.difficulty).to.be.oneOf([
            ProblemDifficulty["Easy"],
            ProblemDifficulty["Medium"],
            ProblemDifficulty["Hard"],
        ]);
        expect(problem.starred).to.be.a("boolean");
        expect(problem.locked).to.be.a("boolean");
        expect(problem.likes).to.be.a("number");
        expect(problem.dislikes).to.be.a("number");
        expect(problem.status).to.be.oneOf([
            ProblemStatus["Accept"],
            ProblemStatus["Not Accept"],
            ProblemStatus["Not Start"],
        ]);
        expect(problem.tag).to.be.an("array");
        expect(problem.totalAccepted).to.be.a("number");
        expect(problem.totalSubmission).to.be.a("number");
        expect(problem.hints).to.be.a("array");
        expect(problem.sampleTestCase).to.be.a("string");
        expect(problem.exampleTestcases).to.be.a("string");
        expect(problem.content).to.be.a("string");
        if (Helper.endpoint === EndPoint.CN) {
            expect(problem.translatedContent).to.be.a("string");
            expect(problem.translatedTitle).to.be.a("string");
        }
        expect(problem.codeSnippets).to.be.an("array");
    });

    it("Could get ContentImages", async () => {
        const contentImages = await problem.getContentImages();
        expect(contentImages.content).to.instanceOf(Map);
        expect(contentImages.translatedContent).to.instanceOf(Map);
    });

    it("Could get submissions", async () => {
        const submissions: Array<Submission> = await problem.getSubmissions();
        expect(submissions).to.be.a("array");
    });

    it("Could submit solution", async () => {
        const submission = await problem.submit(LangSlug.cpp, "test code here");

        setTimeout(async () => {
            await submission.detail();
            expect(submission.statusDisplay).to.be.a("string");
        }, 5000);
    });
});
