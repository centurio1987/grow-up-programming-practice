/**
 * `linear/pieceTable` 실습 채점 — 스텁 `./pieceTable.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./pieceTable.contract.ts` 에, 계약 자체는 `./pieceTable.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/linear/pieceTable/_reference/pieceTable.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { PieceTable } from "./pieceTable";
import {
  type PieceTableContract,
  pieceTableContract,
} from "./pieceTable.contract";

runContract(() => new PieceTable<number>(), pieceTableContract, {
  label: "스텁",
});

/**
 * 주입 정책은 계약의 일부다(규약1). 넘긴 배열 · 돌려받은 배열을 붙들지 않는다는 약속은 호출자 쪽 배열을 고쳐 봐야 드러나므로
 * 참조 모델 대조(축1)가 담지 못한다.
 */
function checkInjectionPolicy(
  label: string,
  make: () => PieceTableContract<number>,
): void {
  describe(`PieceTable 주입 정책 [${label}]`, () => {
    test("넘긴 배열 · 돌려받은 배열을 고쳐도 담긴 수열은 그대로다", () => {
      const sequence = make();
      const given = [1, 2, 3];
      sequence.insert(0, given);
      given[1] = 100;
      given.push(4);
      const listed = sequence.toArray();
      expect(listed).toEqual([1, 2, 3]);
      listed[0] = -1;
      expect(sequence.toArray()).toEqual([1, 2, 3]);
    });
  });
}

checkInjectionPolicy("스텁", () => new PieceTable<number>());
