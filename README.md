<img align="left" width="96px" src="./assets/favicon.png">
<img align="right" width="96px" src="./assets/Typescript_logo_2020.svg.png">

# Leetcode API TS

> Leetcode API written with TypeScript, fully support async.
>
> Thanks for the excellent work for [leetcode-cli](https://github.com/skygragon/leetcode-cli) project! ❤️

[![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/Dup4/Leetcode-API-TS)][leetcode-api-typescript]
[![GitHub package.json version](https://img.shields.io/github/package-json/v/Dup4/Leetcode-API-TS)][leetcode-api-typescript]
[![Build](https://github.com/Dup4/Leetcode-API-TS/actions/workflows/build.yml/badge.svg)](https://github.com/Dup4/Leetcode-API-TS/actions/workflows/build.yml)

## Install

* npm: `npm i leetcode-api-typescript`
* yarn: `yarn add leetcode-api-typescript`

## Usage

```typescript
(async (): Promise<void> => {

    // Login
    const leetcode: Leetcode = await Leetcode.build(
        "your username",
        "your password",
        EndPoint.US     // or EndPoint.CN
    );

    // Get a special problem
    const problem: Problem = new Problem("two-sum");

    // Fetch more properties of this problem
    await problem.detail();

    // Show problem content, test case, code snippet etc
    const content: string = problem.content;
    const testCase: string = problem.sampleTestCase;
    const codeSnippets: Array<codeSnippets> = problem.codeSnippets;

    // submit your answer
    problem.submit("your code language", "your code here");

    // Get All problems' base information
    const problems: Array<Problem> = await leetcode.getAllProblems();

    // Filter problems by status, difficulty, etc
    const acceptedProblems: Array<Problem> = problems.filter((p: Problem) => {
        return p.status === ProblemStatus.Accept;
    });

    acceptedProblems.forEach(async (problem: Problem) => {

        // Get all submissions
        const submissions: Array<Submission> = await problem.getSubmissions();

        // Filter submission which lang = cpp
        const cppSubmissions: Array<Submission> = submissions.filter((s: Submission) => {
            return s.lang === "cpp";
        });

        submissions.forEach((submission: Submission) => {

            // Get submission's status
            const code: string = await submission.detail();

            // Then you can handle them casually
        });
    });
})();
```

## Tips

I especially recommend you fetch base properties first because of the large number of problems. Then call `Problem.detail()` or `Submission.detail()` fetch all properties of them.

## TODO

* [X] ~~*Support Leetcode CN.*~~ [2019-08-24]
* [ ] Fetch more user profile.
* [ ] Fully parse submission status type.
* [ ] Support problems filter by categories.
* [ ] Support problems filter by companies.

## Test

* `mv .env.example .env`
* Update your leetcode account in `.env`
* `yarn test`.

## Contribute

* start: `yarn start`
* build: `yarn build`
* lint: `yarn lint`

## License

MIT.

[leetcode-api-typescript]: https://github.com/Dup4/Leetcode-API-TS
