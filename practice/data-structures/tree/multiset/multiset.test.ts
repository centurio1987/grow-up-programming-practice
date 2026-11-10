/**
 * `tree/multiset` 실습 채점 — 스텁 `./multiset.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./multiset.contract.ts` 에, 계약 자체는 `./multiset.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/tree/multiset/_reference/multiset.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { Multiset } from "./multiset";
import { type MultisetContract, multisetContract } from "./multiset.contract";

/** 학습자 구현. 계측기가 없으므로 축1·축2만 돈다. */
runContract(() => new Multiset<number>(), multisetContract, { label: "스텁" });

/**
 * 주입 정책은 계약의 일부다(규약1). 계약 스위트가 원소 타입 하나로 도는 동안은 여기서 본다.
 */
function checkInjectionPolicy(
  label: string,
  make: <T>(comparator?: (a: T, b: T) => number) => MultisetContract<T>,
): void {
  describe(`Multiset 주입 정책 [${label}]`, () => {
    test("비교자를 갈면 순서가 갈린다 — 순서는 주입자가 정한다", () => {
      const descending = make<number>((a, b) => b - a);
      for (const value of [1, 3, 2]) descending.add(value);
      expect(descending.toArray()).toEqual([3, 2, 1]);
    });

    test("number 밖의 T 도 비교자를 주면 정렬 순서가 성립한다", () => {
      const byLength = make<string>(
        (a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0),
      );
      for (const value of ["banana", "apple", "fig", "apple"])
        byLength.add(value);
      expect(byLength.toArray()).toEqual(["fig", "apple", "apple", "banana"]);
      expect(byLength.count("apple")).toBe(2);
    });
  });
}

checkInjectionPolicy("스텁", (comparator) => new Multiset(comparator));
