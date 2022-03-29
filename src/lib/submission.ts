import Helper from "@/utils/helper";
import { OutputDetail } from "@/utils/interfaces";

class Submission {
    constructor(
        public id: number,
        public lang?: string,
        public memory?: string,
        public runtime?: string,
        public statusDisplay?: string,
        public timestamp?: number,
        public code?: string,
        public sourceUrl?: string,
        public passedTestCaseCnt?: number,
        public totalTestCaseCnt?: number,
        public outputDetail?: OutputDetail
    ) {}

    static async build(id: number): Promise<Submission> {
        const submission: Submission = new Submission(id);
        await submission.detail();
        return submission;
    }

    async detail(): Promise<Submission> {
        const response = await Helper.GraphQLRequest({
            query: `
                query mySubmissionDetail($id: ID!) {
                    submissionDetail(submissionId: $id) {
                    id
                    code
                    runtime
                    memory
                    rawMemory
                    statusDisplay
                    timestamp
                    lang
                    passedTestCaseCnt
                    totalTestCaseCnt
                    sourceUrl
                    question {
                        titleSlug
                        title
                        translatedTitle
                        questionId
                        __typename
                    }
                    ... on GeneralSubmissionNode {
                        outputDetail {
                        codeOutput
                        expectedOutput
                        input
                        compileError
                        runtimeError
                        lastTestcase
                        __typename
                        }
                        __typename
                    }
                    submissionComment {
                        comment
                        flagType
                        __typename
                    }
                    __typename
                    }
                }
            `,
            variables: {
                id: this.id.toString(),
            },
        });

        const submissionDetail = response.submissionDetail;

        this.lang = submissionDetail.lang;
        this.memory = submissionDetail.memory;
        this.runtime = submissionDetail.runtime;
        this.statusDisplay = submissionDetail.statusDisplay;
        this.timestamp = submissionDetail.timestamp;
        this.code = submissionDetail.code;
        this.sourceUrl = Helper.uris.submission.replace(
            "$id",
            this.id.toString()
        );
        this.passedTestCaseCnt = submissionDetail.passedTestCaseCnt;
        this.totalTestCaseCnt = submissionDetail.totalTestCaseCnt;
        this.outputDetail = submissionDetail.outputDetail;

        return this;
    }
}

export default Submission;
