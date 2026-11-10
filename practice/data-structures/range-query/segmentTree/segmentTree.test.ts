/**
 * `range-query/segmentTree` 실습 채점 — 스텁 `./segmentTree.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./segmentTree.contract.ts` 에, 계약 자체는 `./segmentTree.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/range-query/segmentTree/_reference/segmentTree.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { SegmentTree } from "./segmentTree";
import {
  firstNonZero,
  IDENTITY,
  type SegmentTreeContract,
  Sized,
  segmentTreeContract,
} from "./segmentTree.contract";

runContract(
  () => new Sized((values) => new SegmentTree(values, firstNonZero, IDENTITY)),
  segmentTreeContract,
  { label: "스텁" },
);

/**
 * 주입 정책은 계약의 일부다(규약1). 계약 스위트는 결합 **하나**로 도는데
 * (§규약2 「원소 타입이 하나다」) 계약이 요구하는 것은 **임의의** 결합이므로, 같은 구현이
 * 다른 결합에서도 서는지는 여기서 본다.
 */
function checkInjectionPolicy(
  label: string,
  make: (
    values: number[],
    combine: (a: number, b: number) => number,
    identity: number,
  ) => SegmentTreeContract,
): void {
  describe(`SegmentTree 주입 정책 [${label}]`, () => {
    const values = [5, 3, 9, 1, 7, 2];

    test("되돌리는 값이 없는 결합 — 최솟값", () => {
      const tree = make(
        values,
        (a, b) => Math.min(a, b),
        Number.POSITIVE_INFINITY,
      );
      expect(tree.query(0, 6)).toBe(1);
      expect(tree.query(0, 3)).toBe(3);
      expect(tree.query(4, 6)).toBe(2);
      tree.update(3, 8);
      expect(tree.query(0, 6)).toBe(2);
      expect(tree.query(3, 4)).toBe(8);
    });

    test("되돌리는 값이 있는 결합 — 덧셈", () => {
      const tree = make(values, (a, b) => a + b, 0);
      expect(tree.query(0, 6)).toBe(27);
      expect(tree.query(1, 4)).toBe(13);
      tree.update(2, 0);
      expect(tree.query(1, 4)).toBe(4);
    });

    test("빈 구간의 답은 주입받은 항등원이다", () => {
      expect(
        make(values, (a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY).query(
          2,
          2,
        ),
      ).toBe(Number.NEGATIVE_INFINITY);
      expect(make(values, (a, b) => a * b, 1).query(0, 0)).toBe(1);
      expect(make([], (a, b) => a + b, 0).query(0, 0)).toBe(0);
    });

    test("교환적이지 않은 결합에서 자리의 순서가 지켜진다", () => {
      // 왼쪽에서 처음 만나는 0 아닌 값. `1 ∘ 2 = 1` 인데 `2 ∘ 1 = 2` 다.
      const tree = make([0, 0, 0, 5, 0, 0, 9, 0], firstNonZero, IDENTITY);
      expect(tree.query(1, 7)).toBe(5);
      expect(tree.query(4, 8)).toBe(9);
      tree.update(3, 0);
      expect(tree.query(1, 7)).toBe(9);
    });
  });
}

checkInjectionPolicy(
  "스텁",
  (values, combine, identity) => new SegmentTree(values, combine, identity),
);
