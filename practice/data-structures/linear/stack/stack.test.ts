/**
 * `linear/stack` 실습 채점 — 스텁 `./stack.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./stack.contract.ts` 에, 계약 자체는 `./stack.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/linear/stack/_reference/stack.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { runContract } from "../../_contract/runContract";
import { Stack } from "./stack";
import { stackContract } from "./stack.contract";

/** 학습자 구현. 계측기가 없으므로 축1·축2만 돈다 — 스텁에 `__cost` 를 요구하지 않는다. */
runContract(() => new Stack<number>(), stackContract, { label: "스텁" });
