import { StatusCodeError } from "request-promise-native/errors";
import Helper from "@/utils/helper";
import { Credit, EndPoint, Uris } from "@/utils/interfaces";
import Problem from "./problem";

class Leetcode {
    session?: string;
    csrfToken: string;

    constructor(credit: Credit) {
        this.session = credit.session;
        this.csrfToken = credit.csrfToken;
    }

    get credit(): Credit {
        return {
            session: this.session,
            csrfToken: this.csrfToken,
        };
    }

    static async build(
        endpoint: EndPoint,
        props?: {
            username?: string;
            password?: string;
            cookie?: string;
        }
    ): Promise<Leetcode> {
        Helper.switchEndPoint(endpoint);

        const credit = await (async (): Promise<Credit> => {
            if (props?.cookie) {
                return await this.getCredit(props.cookie.split(" "));
            }

            return await this.login(
                props?.username ?? "",
                props?.password ?? ""
            );
        })();

        Helper.setCredit(credit);

        return new Leetcode(credit);
    }

    static async login(username: string, password: string): Promise<Credit> {
        const csrfToken = await (async () => {
            // got login token first
            const response = await Helper.HttpRequest({
                url: Helper.uris.login,
                resolveWithFullResponse: true,
            });

            // Leetcode CN return null here, but it's does not matter
            const csrfToken: string = Helper.parseCookie(
                response.headers["set-cookie"],
                "csrftoken"
            );

            Helper.setCredit({ csrfToken });

            return csrfToken;
        })();

        try {
            const response = await Helper.HttpRequest({
                method: "POST",
                url: Helper.uris.login,
                form: {
                    csrfmiddlewaretoken: csrfToken,
                    login: username,
                    password: password,
                },
                resolveWithFullResponse: true,
            });

            return await this.getCredit(response.headers["set-cookie"]);
        } catch (e) {
            if (e instanceof StatusCodeError) {
                throw new Error("Login Fail");
            }
        }

        return { csrfToken };
    }

    static async getCredit(cookie: Array<string>): Promise<Credit> {
        const session = Helper.parseCookie(cookie, "LEETCODE_SESSION");
        const csrfToken = Helper.parseCookie(cookie, "csrftoken");

        return {
            session,
            csrfToken,
        };
    }

    async getProfile(): Promise<any> {
        // TODO: fetch more user profile.
        const response: any = await Helper.GraphQLRequest({
            query: `
            {
                user {
                    username
                }
            }
            `,
        });

        return response.user;
    }

    async getAllProblems(): Promise<Array<Problem>> {
        let response = await Helper.HttpRequest({
            url: Helper.uris.problemsAll,
        });

        response = JSON.parse(response);
        const problems: Array<Problem> = response.stat_status_pairs.map(
            (p: any) => {
                return new Problem(
                    p.stat.question__title_slug,
                    p.stat.question_id,
                    p.stat.question__title,
                    Helper.difficultyMap(p.difficulty.level),
                    p.is_favor,
                    p.paid_only,
                    undefined,
                    undefined,
                    Helper.statusMap(p.status),
                    undefined,
                    p.stat.total_acs,
                    p.stat.total_submitted,
                    undefined,
                    undefined,
                    undefined
                );
            }
        );

        return problems;
    }

    async getProblemsByTag(tag: string): Promise<Array<Problem>> {
        const response = await Helper.GraphQLRequest({
            query: `
                query getTopicTag($slug: String!) {
                    topicTag(slug: $slug) {
                        questions {
                            status
                            questionId
                            title
                            titleSlug
                            stats
                            difficulty
                            isPaidOnly
                            topicTags {
                                slug
                            }
                        }
                    }
                }
            `,
            variables: {
                slug: tag,
            },
        });

        const problems: Array<Problem> = response.topicTag.questions.map(
            (p: any) => {
                const stat: any = JSON.parse(p.stats);
                return new Problem(
                    p.titleSlug,
                    p.questionId,
                    p.title,
                    stat.title,
                    undefined,
                    p.isPaidOnly,
                    undefined,
                    undefined,
                    Helper.statusMap(p.status),
                    p.topicTags.map((t: any) => t.slug),
                    stat.totalAcceptedRaw,
                    stat.totalSubmissionRaw,
                    undefined,
                    undefined,
                    undefined
                );
            }
        );

        return problems;
    }
}

export default Leetcode;
