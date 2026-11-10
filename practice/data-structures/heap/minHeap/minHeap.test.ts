/**
 * `heap/minHeap` 실습 채점 — 스텁 `./minHeap.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./minHeap.contract.ts` 에, 계약 자체는 `./minHeap.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/heap/minHeap/_reference/minHeap.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { runContract } from "../../_contract/runContract";
import { ascending } from "../priorityQueue/priorityQueue.contract";
import { MinHeap } from "./minHeap";
import { minHeapContract } from "./minHeap.contract";

runContract(() => new MinHeap<number>(ascending), minHeapContract, {
  label: "스텁",
});
