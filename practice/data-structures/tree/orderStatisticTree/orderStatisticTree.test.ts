/**
 * `tree/orderStatisticTree` 실습 채점 — 스텁 `./orderStatisticTree.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./orderStatisticTree.contract.ts` 에, 계약 자체는 `./orderStatisticTree.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/tree/orderStatisticTree/_reference/orderStatisticTree.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { OrderStatisticTree } from "./orderStatisticTree";
import {
  type OrderStatisticTreeContract,
  orderStatisticTreeContract,
} from "./orderStatisticTree.contract";

/** 학습자 구현. 계측기가 없으므로 축1·축2만 돈다. */
runContract(
  () => new OrderStatisticTree<number>(),
  orderStatisticTreeContract,
  { label: "스텁" },
);

/**
 * 주입 정책은 계약의 일부다(규약1). 계약 스위트가 원소 타입 하나로 도는 동안은 여기서 본다.
 */
function checkInjectionPolicy(
  label: string,
  make: <T>(
    comparator?: (a: T, b: T) => number,
  ) => OrderStatisticTreeContract<T>,
): void {
  describe(`OrderStatisticTree 주입 정책 [${label}]`, () => {
    test("비교자를 갈면 위치 좌표계가 함께 갈린다 — 순서는 주입자가 정한다", () => {
      const descending = make<number>((a, b) => b - a);
      for (const value of [1, 3, 2]) descending.add(value);
      expect(descending.toArray()).toEqual([3, 2, 1]);
      // 순서를 뒤집으면 「앞선다」의 뜻도 뒤집힌다. 위치는 비교자가 정하는 것이지 값의
      // 크기가 정하는 것이 아니다.
      expect(descending.at(0)).toBe(3);
      expect(descending.rankOf(2)).toBe(1);
    });

    test("number 밖의 T 도 비교자를 주면 위치 질의가 성립한다", () => {
      const byLength = make<string>(
        (a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0),
      );
      for (const value of ["banana", "apple", "fig", "apple"])
        byLength.add(value);
      expect(byLength.toArray()).toEqual(["fig", "apple", "apple", "banana"]);
      expect(byLength.at(1)).toBe("apple");
      expect(byLength.rankOf("banana")).toBe(3);
      expect(byLength.count("apple")).toBe(2);
    });
  });
}

checkInjectionPolicy(
  "스텁",
  (comparator) => new OrderStatisticTree(comparator),
);
