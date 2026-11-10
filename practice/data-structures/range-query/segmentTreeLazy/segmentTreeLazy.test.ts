/**
 * `range-query/segmentTreeLazy` 실습 채점 — 스텁 `./segmentTreeLazy.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./segmentTreeLazy.contract.ts` 에, 계약 자체는 `./segmentTreeLazy.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/range-query/segmentTreeLazy/_reference/segmentTreeLazy.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { SegmentTreeLazy } from "./segmentTreeLazy";
import {
  type Act,
  addAct,
  addCompose,
  COUNTED_SLOTS,
  type Combine,
  type Compose,
  coverAct,
  coverCompose,
  firstNonZero,
  IDENTITY,
  LazySized,
  type SegmentTreeLazyContract,
  segmentTreeLazyContract,
  segmentTreeLazyCountedContract,
  sum,
} from "./segmentTreeLazy.contract";

runContract(
  () =>
    new LazySized(
      (values) =>
        new SegmentTreeLazy(
          values,
          firstNonZero,
          IDENTITY,
          coverAct,
          coverCompose,
        ),
    ),
  segmentTreeLazyContract,
  { label: "스텁" },
);

runContract(
  () =>
    new LazySized(
      (values) => new SegmentTreeLazy(values, sum, 0, addAct, addCompose),
      COUNTED_SLOTS,
    ),
  segmentTreeLazyCountedContract,
  { label: "스텁 · 자리 수 대수" },
);

/**
 * 주입 정책은 계약의 일부다(규약1). 계약 스위트는 대수 **하나**로 도는데 계약이 요구하는 것은 세 법칙을
 * 지키는 **임의의** 대수이므로, 같은 구현이 다른 대수에서도 서는지는 여기서 본다. 첫째(구간 더하기 · 구간 합)는
 * 스위트 둘째 벌과 같은 대수이고 작은 손 계산 값으로 한 번 더 짚는다.
 */
function checkInjectionPolicy(
  label: string,
  make: (
    values: number[],
    combine: Combine,
    identity: number,
    act: Act,
    compose: Compose,
  ) => SegmentTreeLazyContract,
): void {
  describe(`SegmentTreeLazy 주입 정책 [${label}]`, () => {
    test("덮는 자리 수를 쓰는 갱신 — 구간 더하기 · 구간 합", () => {
      const tree = make(
        [0, 0, 0, 0, 0, 0],
        (a, b) => a + b,
        0,
        (update, value, count) => value + update * count,
        (later, earlier) => later + earlier,
      );
      tree.apply(0, 3, 3);
      expect(tree.query(0, 6)).toBe(9);
      expect(tree.query(2, 4)).toBe(3);
      tree.apply(1, 6, 2);
      expect(tree.query(0, 6)).toBe(19);
      expect(tree.query(3, 4)).toBe(2);
      tree.apply(2, 3, -10);
      expect(tree.query(0, 3)).toBe(3);
      expect(tree.query(1, 5)).toBe(4);
    });

    test("되돌리는 값이 없는 결합 — 구간 더하기 · 구간 최솟값", () => {
      const tree = make(
        [5, 3, 9, 1, 7, 2],
        (a, b) => Math.min(a, b),
        Number.POSITIVE_INFINITY,
        (update, value) => value + update,
        (later, earlier) => later + earlier,
      );
      expect(tree.query(0, 6)).toBe(1);
      tree.apply(2, 5, 10);
      expect(tree.query(0, 6)).toBe(2);
      expect(tree.query(2, 5)).toBe(11);
      tree.apply(0, 6, -1);
      expect(tree.query(3, 4)).toBe(10);
      expect(tree.query(0, 0)).toBe(Number.POSITIVE_INFINITY);
    });

    test("나중 갱신이 이기는 합성 — 구간 덮기 · 구간 합", () => {
      const tree = make(
        [1, 2, 3, 4, 5, 6, 7, 8],
        (a, b) => a + b,
        0,
        (update, _value, count) => update * count,
        (later) => later,
      );
      tree.apply(0, 8, 1);
      tree.apply(2, 6, 3);
      expect(tree.query(0, 8)).toBe(16);
      tree.apply(3, 4, 0);
      expect(tree.query(2, 6)).toBe(9);
      expect(tree.query(6, 8)).toBe(2);
    });

    test("자리가 없는 수열은 빈 구간 하나만 묻고 답은 항등원이다", () => {
      const tree = make(
        [],
        (a, b) => a + b,
        0,
        (update, value, count) => value + update * count,
        (later, earlier) => later + earlier,
      );
      tree.apply(0, 0, 5);
      expect(tree.query(0, 0)).toBe(0);
      expect(() => tree.query(0, 1)).toThrow(RangeError);
    });
  });
}

checkInjectionPolicy(
  "스텁",
  (values, combine, identity, act, compose) =>
    new SegmentTreeLazy(values, combine, identity, act, compose),
);
