import { expect } from "chai";
import Dotenv from "dotenv";
import "mocha";
import Leetcode from "../src";
import Problem from "../src/lib/problem";
import Submission from "../src/lib/submission";
import { EndPoint, ProblemStatus } from "../src/utils/interfaces";

describe("# Submission", async function () {
    let submission: Submission;

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

        const leetcode = await Leetcode.build(
            process.env.LEETCODE_ENDPOINT === "CN" ? EndPoint.CN : EndPoint.US,
            props
        );

        const problems: Array<Problem> = await leetcode.getAllProblems();
        const acceptedProblems: Array<Problem> = problems.filter(
            (p: Problem) => {
                return p.status === ProblemStatus.Accept;
            }
        );
        const submissions: Array<Submission> =
            await acceptedProblems[0].getSubmissions();
        submission = submissions[0];
        await submission.detail();
    });

    it("Should be instance of Submission", () => {
        expect(submission).to.instanceOf(Submission);
    });

    it("Should has base field", () => {
        expect(submission.id).to.be.an("number");
        expect(submission.lang).to.be.a("string");
        expect(submission.memory).to.be.a("string");
        expect(submission.runtime).to.be.a("string");
        expect(submission.statusDisplay).to.be.a("string");
        expect(submission.timestamp).to.be.an("number");
        expect(submission.code).to.be.a("string");
        expect(submission.getSubmissionUrl()).to.be.a("string");
    });
});
