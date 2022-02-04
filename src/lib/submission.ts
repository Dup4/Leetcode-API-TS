import Helper from "@/utils/helper";
import { Uris } from "@/utils/interfaces";

class Submission {
    static uris: Uris;

    static setUris(uris: Uris): void {
        Submission.uris = uris;
    }

    constructor(
        public id: number,
        public lang?: string,
        public memory?: string,
        public runtime?: string,
        public statusDisplay?: string,
        public timestamp?: number,
        public code?: string
    ) {}

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

        return this;
    }
}

export default Submission;
