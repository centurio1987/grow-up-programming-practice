/**
 * `probabilistic/bloomFilter` 실습 채점 — 스텁 `./bloomFilter.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./bloomFilter.contract.ts` 에, 계약 자체는 `./bloomFilter.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/probabilistic/bloomFilter/_reference/bloomFilter.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { runContract } from "../../_contract/runContract";
import { trialContract } from "../../_contract/runTrials";
import { BloomFilter } from "./bloomFilter";
import {
  bloomFilterContract,
  bloomFilterTrials,
  SizedFilter,
} from "./bloomFilter.contract";

runContract(
  () => new SizedFilter((n, rate) => new BloomFilter(n, rate)),
  bloomFilterContract,
  { label: "스텁" },
);

trialContract(bloomFilterTrials, {
  label: "스텁",
  implementation: {
    module: new URL("./bloomFilter.ts", import.meta.url).href,
    exportName: "BloomFilter",
  },
});
