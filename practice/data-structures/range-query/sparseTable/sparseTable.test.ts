/**
 * `range-query/sparseTable` 실습 채점 — 스텁 `./sparseTable.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./sparseTable.contract.ts` 에, 계약 자체는 `./sparseTable.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/range-query/sparseTable/_reference/sparseTable.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { SparseTable } from "./sparseTable";
import {
  firstNonZero,
  IDENTITY,
  Reindexable,
  type SparseTableContract,
  sparseTableContract,
} from "./sparseTable.contract";

runContract(
  () =>
    new Reindexable(
      (values) => new SparseTable(values, firstNonZero, IDENTITY),
    ),
  sparseTableContract,
  { label: "스텁" },
);

/**
 * 주입 정책은 계약의 일부다(규약1). 계약 스위트는 결합 **하나**로 도는데 계약이 요구하는 것은 세 의무(결합법칙 · 항등원 ·
 * 멱등)를 지키는 **임의의** 결합이므로, 같은 구현이 다른 멱등 결합에서도 서는지와 호출자가 넘긴 배열을 고쳐도 답이 그대로인지는
 * 여기서 본다.
 */
function checkInjectionPolicy(
  label: string,
  make: (
    values: number[],
    combine: (a: number, b: number) => number,
    identity: number,
  ) => SparseTableContract,
): void {
  describe(`SparseTable 주입 정책 [${label}]`, () => {
    const values = [300, 60, 3600, 120, 900, 1800, 30];

    test("최솟값 · 최댓값 — 교환적인 멱등 결합", () => {
      const low = make(values, (a, b) => Math.min(a, b), Infinity);
      expect(low.query(0, 7)).toBe(30);
      expect(low.query(0, 3)).toBe(60);
      expect(low.query(3, 6)).toBe(120);
      const high = make(values, (a, b) => Math.max(a, b), -Infinity);
      expect(high.query(0, 7)).toBe(3600);
      expect(high.query(3, 6)).toBe(1800);
      expect(high.query(4, 4)).toBe(-Infinity);
    });

    test("최대공약수 — 항등원이 0 인 멱등 결합", () => {
      const gcd = (a: number, b: number): number =>
        b === 0 ? a : gcd(b, a % b);
      const table = make([12, 8, 6, 4], gcd, 0);
      expect(table.query(0, 4)).toBe(2);
      expect(table.query(0, 2)).toBe(4);
      expect(table.query(2, 2)).toBe(0);
    });

    test("자리가 없는 수열은 빈 구간 하나만 묻고 답은 항등원이다", () => {
      const table = make([], (a, b) => Math.min(a, b), Infinity);
      expect(table.query(0, 0)).toBe(Infinity);
      expect(() => table.query(0, 1)).toThrow(RangeError);
    });

    test("생성자가 돌아온 뒤 호출자가 배열을 고쳐도 답은 그대로다", () => {
      const own = [5, 3, 8, 1, 7];
      const table = make(own, (a, b) => Math.min(a, b), Infinity);
      own[3] = 100;
      own.push(-9);
      expect(table.query(0, 5)).toBe(1);
      expect(() => table.query(0, 6)).toThrow(RangeError);
    });
  });
}

checkInjectionPolicy(
  "스텁",
  (values, combine, identity) => new SparseTable(values, combine, identity),
);
