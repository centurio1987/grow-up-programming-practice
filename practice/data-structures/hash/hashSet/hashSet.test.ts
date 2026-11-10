/**
 * `hash/hashSet` 실습 채점 — 스텁 `./hashSet.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./hashSet.contract.ts` 에, 계약 자체는 `./hashSet.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/hash/hashSet/_reference/hashSet.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { runContract } from "../../_contract/runContract";
import { HashSet } from "./hashSet";
import { hashSetContract, SetPair } from "./hashSet.contract";

/** 축1·축2가 도는 펴기. 정수 원소를 그대로 돌려주므로 정보를 하나도 지우지 않는다. */
const identity = (item: number): number => item;

/** 학습자 구현. 계측기가 없으므로 축1·축2만 돈다. */
runContract(
  () => new SetPair<number>(() => new HashSet<number>(identity)),
  hashSetContract,
  { label: "스텁" },
);
