import { LangSlug } from "./../utils/interfaces";
import Helper from "@/utils/helper";
import {
    EndPoint,
    ProblemDifficulty,
    ProblemStatus,
    Uris,
    CodeSnippet,
} from "@/utils/interfaces";
import Submission from "./submission";

class Problem {
    constructor(
        readonly slug: string,
        public id?: number,
        public title?: string,
        public difficulty?: ProblemDifficulty,
        public starred?: boolean,
        public locked?: boolean,
        public likes?: number,
        public dislikes?: number,
        public status?: ProblemStatus,
        public tag?: Array<string>,
        public totalAccepted?: number,
        public totalSubmission?: number,

        public hints?: Array<string>,
        public sampleTestCase?: string,
        public exampleTestcases?: string,
        public content?: string,
        public translatedContent?: string,
        public translatedTitle?: string,
        public codeSnippets?: Array<CodeSnippet>
    ) {}

    static async build(slug: string): Promise<Problem> {
        const problem: Problem = new Problem(slug);
        await problem.detail();
        return problem;
    }

    async detail(): Promise<Problem> {
        const response = await Helper.GraphQLRequest({
            query: `
                query getQuestionDetail($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        questionId
                        title
                        difficulty
                        likes
                        dislikes
                        isLiked
                        isPaidOnly
                        stats
                        status
                        content
                        topicTags {
                            name
                        }
                        codeSnippets {
                            lang
                            langSlug
                            code
                        }
                        hints
                        exampleTestcases
                        sampleTestCase
                        ${
                            Helper.endpoint === EndPoint.CN
                                ? "translatedContent"
                                : ""
                        }
                        ${
                            Helper.endpoint === EndPoint.CN
                                ? "translatedTitle"
                                : ""
                        }
                    }
                }
            `,
            variables: {
                titleSlug: this.slug,
            },
        });

        const question = response.question;
        this.id = Number(question.questionId);
        this.title = question.title;
        this.difficulty = Helper.difficultyMap(question.difficulty);
        this.starred = question.isLiked !== null;
        this.locked = question.isPaidOnly;
        this.likes = question.likes;
        this.dislikes = question.dislikes;
        this.status = Helper.statusMap(question.status);
        this.tag = question.topicTags.map(function (t: any) {
            return t.name;
        });
        const stats: any = JSON.parse(question.stats);
        this.totalAccepted = stats.totalAcceptedRaw;
        this.totalSubmission = stats.totalSubmissionRaw;

        this.hints = question.hints;
        this.sampleTestCase = question.sampleTestCase;
        this.exampleTestcases = question.exampleTestcases;
        this.content = question.content;
        this.translatedContent = question.translatedContent;
        this.translatedTitle = question.translatedTitle;
        this.codeSnippets = question.codeSnippets;

        return this;
    }

    async getSubmissions(): Promise<Array<Submission>> {
        const submissions: Array<Submission> = [];
        let offset = 0;
        const limit = 20;
        let hasNext = true;
        while (hasNext) {
            const response = await Helper.GraphQLRequest({
                query: `
                query Submissions($offset: Int!, $limit: Int!, $questionSlug: String!) {
                    submissionList(offset: $offset, limit: $limit, questionSlug: $questionSlug) {
                        lastKey
                        hasNext
                        submissions {
                            id
                            statusDisplay
                            lang
                            runtime
                            timestamp
                            url
                            isPending
                            memory
                        }
                    }
                }
                `,
                variables: {
                    offset: offset,
                    limit: limit,
                    questionSlug: this.slug,
                },
            });

            hasNext = response.submissionList.hasNext;
            const submission: Array<any> = response.submissionList.submissions;
            offset += submission.length;
            submission.map((s) => {
                submissions.push(
                    new Submission(
                        Number(s.id),
                        s.lang,
                        s.memory,
                        s.runtime,
                        s.statusDisplay,
                        Number(s.timestamp)
                    )
                );
            });
        }

        return submissions;
    }

    async submit(langSlug: LangSlug, code: string): Promise<Submission> {
        const response = await Helper.HttpRequest({
            url: Helper.uris.submit.replace("$slug", this.slug),
            method: "POST",
            body: {
                lang: LangSlug[langSlug],
                // eslint-disable-next-line @typescript-eslint/camelcase
                question_id: this.id,
                // eslint-disable-next-line @typescript-eslint/camelcase
                typed_code: code,
            },
        });

        return new Submission(JSON.parse(response).submission_id);
    }
}

export default Problem;
