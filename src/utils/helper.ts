import { GraphQLClient } from "graphql-request";
import Request from "request-promise-native";
import Config from "@/lib/config";
import {
    Credit,
    EndPoint,
    GraphQLRequestOptions,
    HttpRequestOptions,
    ProblemDifficulty,
    ProblemStatus,
    Uris,
} from "./interfaces";

class Helper {
    static credit: Credit;
    static uris: Uris;
    static endpoint: EndPoint;

    static setCredit(credit: Credit): void {
        Helper.credit = credit;
    }

    static setUris(uris: Uris): void {
        Helper.uris = uris;
    }

    static setEndpoint(endpoint: EndPoint): void {
        Helper.endpoint = endpoint;
    }

    static parseCookie(cookies: Array<string>, key: string): string {
        if (!cookies) {
            return "";
        }

        for (let ix = 0; ix !== cookies.length; ++ix) {
            const result = cookies[ix].match(new RegExp(`${key}=(.+?);`));

            if (result) {
                return result[1] || "";
            }
        }

        return "";
    }

    static statusMap(status: string | null): ProblemStatus {
        switch (status) {
            case "ac":
                return ProblemStatus.Accept;
            case "notac":
                return ProblemStatus.NotAccept;
            case null:
                return ProblemStatus.NotStart;
            default:
                return ProblemStatus.NotStart;
        }
    }

    static difficultyMap(difficulty: string): ProblemDifficulty {
        switch (difficulty) {
            case "Easy":
                return ProblemDifficulty.Easy;
            case "Medium":
                return ProblemDifficulty.Medium;
            case "Hard":
                return ProblemDifficulty.Hard;
            default:
                return ProblemDifficulty.Easy;
        }
    }

    static async HttpRequest(options: HttpRequestOptions): Promise<any> {
        return await Request({
            method: options.method || "GET",
            uri: options.url,
            followRedirect: false,
            headers: {
                Cookie: Helper.credit
                    ? `LEETCODE_SESSION=${Helper.credit.session};csrftoken=${Helper.credit.csrfToken}`
                    : "",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": Helper.credit ? Helper.credit.csrfToken : "",
                Referer: options.referer || Helper.uris.base,
            },
            resolveWithFullResponse: options.resolveWithFullResponse || false,
            form: options.form || null,
            body: JSON.stringify(options.body) || "",
            encoding: options.encoding || "utf-8",
        });
    }

    static async GraphQLRequest(options: GraphQLRequestOptions): Promise<any> {
        const client = new GraphQLClient(Helper.uris.graphql, {
            headers: {
                Origin: options.origin || Helper.uris.base,
                Referer: options.referer || Helper.uris.base,
                Cookie: `LEETCODE_SESSION=${Helper.credit.session};csrftoken=${Helper.credit.csrfToken};`,
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": Helper.credit.csrfToken,
            },
        });

        return await client.request(options.query, options.variables || {});
    }

    static switchEndPoint(endPoint: EndPoint): void {
        Helper.setEndpoint(endPoint);

        const uris = ((): Uris => {
            switch (endPoint) {
                case EndPoint.US:
                    return Config.uri.us;
                case EndPoint.CN:
                    return Config.uri.cn;
            }
        })();

        Helper.setUris(uris);
    }
}

export default Helper;
