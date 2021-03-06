import Helper from "@/utils/helper";
import {
    EndPoint,
    CodeSnippet,
    LangSlug,
    ProblemDifficulty,
    ProblemStatus,
    TopicTag,
} from "@/utils/interfaces";
import Submission from "./submission";
import * as cherrio from "cheerio";

class Problem {
    constructor(
        readonly slug: string,
        public id?: number,
        public frontendId?: number,
        public title?: string,
        public categoryTitle?: string,
        public difficulty?: ProblemDifficulty,
        public starred?: boolean,
        public locked?: boolean,
        public likes?: number,
        public dislikes?: number,
        public status?: ProblemStatus,
        public tag?: Array<TopicTag>,
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
                        questionFrontendId
                        title
                        categoryTitle
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
                            slug
                            ${
                                Helper.endpoint === EndPoint.CN
                                    ? "translatedName"
                                    : ""
                            }
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
        this.frontendId = Number(question.questionFrontendId);
        this.title = question.title;
        this.categoryTitle = question.categoryTitle;
        this.difficulty = Helper.difficultyMap(question.difficulty);
        this.starred = question.isLiked !== null;
        this.locked = question.isPaidOnly;
        this.likes = question.likes;
        this.dislikes = question.dislikes;
        this.status = Helper.statusMap(question.status);
        this.tag = question.topicTags;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    async getContentImages(): Promise<{
        content: Map<string, string>;
        translatedContent: Map<string, string>;
    }> {
        const res = {
            content: new Map<string, string>(),
            translatedContent: new Map<string, string>(),
        };

        const getImg = async (htmlContent: string, mp: Map<string, string>) => {
            const $ = cherrio.load(htmlContent);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            $("img").each((ix: number, e: any) => {
                mp.set($(e).attr("src") as string, "");
            });

            for (const key of mp.keys()) {
                const resp = await Helper.HttpRequest({
                    url: key,
                    encoding: "binary",
                });

                mp.set(key, resp);
            }
        };

        if (this.content) {
            await getImg(this.content, res.content);
        }

        if (this.translatedContent) {
            await getImg(this.translatedContent, res.translatedContent);
        }

        return res;
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
                            memory
                            url
                            isPending
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        Number(s.timestamp),
                        undefined,
                        Helper.uris.submission.replace("$id", s.id.toString())
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
                question_id: this.id,
                typed_code: code,
            },
        });

        return new Submission(JSON.parse(response).submission_id);
    }
}

export default Problem;
