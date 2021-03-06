/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequestOptions {
    method?: string;
    url: string;
    referer?: string;
    resolveWithFullResponse?: boolean;
    form?: any;
    body?: any;
    encoding?: any;
}

export interface GraphQLRequestOptions {
    origin?: string;
    referer?: string;
    query: string;
    variables?: object;
}

export interface Credit {
    session?: string;
    csrfToken: string;
}

export interface TopicTag {
    name: string;
    slug: string;
    translatedName?: string;
}

export interface CodeSnippet {
    lang: string;
    langSlug: string;
    code: string;
}

export interface ContestInfo {
    id: number;
    title: string;
    title_slug: string;
    description: string;
    duration: number;
    start_time: number;
    is_virtual: boolean;
    origin_start_time: number;
    is_private: boolean;
    related_contest_title: string | null;
}

export interface SimpleProblemInfoInContest {
    id: number;
    question_id: number;
    credit: number;
    title: string;
    english_title: string;
    title_slug: string;
    category_slug: string;
}

export interface Company {
    name: string;
    description: string;
    logo: string;
    slug: string;
}

export enum LangSlug {
    "cpp" = "cpp",
    "java" = "java",
    "python" = "python",
    "python3" = "python3",
    "c" = "c",
    "csharp" = "csharp",
    "javascript" = "javascript",
    "ruby" = "ruby",
    "swift" = "swift",
    "golang" = "golang",
    "scala" = "scala",
    "kotlin" = "kotlin",
    "rust" = "rust",
    "php" = "php",
    "typescript" = "typescript",
    "racket" = "racket",
    "erlang" = "erlang",
    "elixir" = "elixir",
}

export const LangText: Record<LangSlug, string> = {
    [LangSlug.cpp]: "C++",
    [LangSlug.java]: "Java",
    [LangSlug.python]: "Python 2",
    [LangSlug.python3]: "Python 3",
    [LangSlug.c]: "C",
    [LangSlug.csharp]: "C#",
    [LangSlug.javascript]: "JavaScript",
    [LangSlug.ruby]: "Ruby",
    [LangSlug.swift]: "Swift",
    [LangSlug.golang]: "Go",
    [LangSlug.scala]: "Scala",
    [LangSlug.kotlin]: "Kotlin",
    [LangSlug.rust]: "Rust",
    [LangSlug.php]: "PHP",
    [LangSlug.typescript]: "TypeScript",
    [LangSlug.racket]: "Racket",
    [LangSlug.erlang]: "Erlang",
    [LangSlug.elixir]: "Elixir",
};

export function LangExt(langSlug: LangSlug): string {
    switch (langSlug) {
        case LangSlug.cpp:
            return "cpp";
        case LangSlug.java:
            return "java";
        case LangSlug.python:
            return "py2";
        case LangSlug.python3:
            return "py";
        case LangSlug.c:
            return "c";
        case LangSlug.csharp:
            return "cs";
        case LangSlug.javascript:
            return "js";
        case LangSlug.ruby:
            return "rb";
        case LangSlug.swift:
            return "swift";
        case LangSlug.golang:
            return "go";
        case LangSlug.scala:
            return "scala";
        case LangSlug.kotlin:
            return "kotlin";
        case LangSlug.rust:
            return "rs";
        case LangSlug.php:
            return "php";
        case LangSlug.typescript:
            return "ts";
        case LangSlug.racket:
            return "racket";
        case LangSlug.erlang:
            return "erlang";
        case LangSlug.elixir:
            return "elixir";
        default:
            return "unknown";
    }
}

export enum ProblemStatus {
    "Accept",
    "NotAccept",
    "NotStart",
}

export enum ProblemDifficulty {
    "Easy",
    "Medium",
    "Hard",
}

export enum SubmissionStatus {
    "Accepted",
    "Compile Error",
    "Wrong Answer",
    "Time Limit Exceeded",
}

export enum EndPoint {
    "US",
    "CN",
}

export interface Uris {
    base: string;
    login: string;
    graphql: string;
    problemsAll: string;
    problem: string;
    contestInfo: string;
    submit: string;
    submission: string;
}

export interface OutputDetail {
    codeOutput: string;
    expectedOutput: string;
    input: string;
    compileError: string;
    runtimeError: string;
    lastTestcase: string;
    __typename: string;
}
