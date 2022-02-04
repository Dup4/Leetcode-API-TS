import { expect } from "chai";
import Dotenv from "dotenv";
import "mocha";
import Leetcode from "../src";
import Contest from "../src/lib/contest";
import { EndPoint } from "../src/utils/interfaces";

describe("# Contest", async function () {
    const contest: Contest = new Contest(Contest.getWeeklyContestSlug(100));

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

        await contest.detail();
    });

    it("Should be instance of Contest", () => {
        expect(contest).to.instanceOf(Contest);
    });

    it("Should contain base field", () => {
        expect(contest.contest).to.exist;
        expect(contest.questions).to.be.a("array");
        expect(contest.user_num).to.be.a("number");
        expect(contest.has_chosen_contact).to.be.a("boolean");
        expect(contest.company).to.exist;
        expect(contest.registered).to.be.a("boolean");
        expect(contest.containsPremium).to.be.a("boolean");
    });

    it("Should contain 4 problems", async () => {
        const p = await contest.getProblems();
        expect(p).to.be.a("array");
        expect(p.length).equal(4);
    });
});
