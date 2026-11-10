/**
 * `spatial/kdTree` 실습 채점 — 스텁 `./kdTree.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./kdTree.contract.ts` 에, 계약 자체는 `./kdTree.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/spatial/kdTree/_reference/kdTree.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { KDTree, type Point2D } from "./kdTree";
import { type KDTreeSurface, kdTreeContract } from "./kdTree.contract";

runContract(() => new KDTree(), kdTreeContract, { label: "스텁" });

/**
 * 주입 정책은 계약의 일부다(규약1). 경계 케이스가 vector 로도 나가므로 JSON 에 못 담는 값(무한 · NaN)과 배열을 붙들지 않는다는
 * 약속은 여기서 본다.
 */
function checkInjectionPolicy(label: string, make: () => KDTreeSurface): void {
  describe(`KDTree 주입 정책 [${label}]`, () => {
    test("사각형 모서리는 무한이어도 되고 NaN 이면 RangeError 다", () => {
      const index = make();
      index.insert([3, -4]);
      index.insert([-2, 7]);
      expect(index.rangeSearch([-Infinity, -Infinity], [Infinity, 0])).toEqual([
        [3, -4],
      ]);
      expect(() => index.rangeSearch([Number.NaN, 0], [1, 1])).toThrow(
        RangeError,
      );
    });

    test("점 좌표가 NaN · 무한이면 RangeError 이고 상태가 안 바뀐다", () => {
      const index = make();
      expect(() => index.insert([Number.NaN, 0])).toThrow(RangeError);
      expect(() => index.insert([0, Infinity])).toThrow(RangeError);
      expect(() => index.nearestNeighbor([Number.NaN, 0])).toThrow(RangeError);
      expect(index.nearestNeighbor([0, 0])).toBeNull();
      expect(index.rangeSearch([-10, -10], [10, 10])).toEqual([]);
    });

    test("넘긴 배열 · 돌려받은 배열을 고쳐도 담긴 점은 그대로다", () => {
      const index = make();
      const given: Point2D = [1, 2];
      index.insert(given);
      given[0] = 100;
      const found = index.rangeSearch([0, 0], [5, 5]);
      expect(found).toEqual([[1, 2]]);
      (found[0] as Point2D)[1] = 50;
      const nearest = index.nearestNeighbor([0, 0]);
      expect(nearest).toEqual([1, 2]);
      (nearest as Point2D)[0] = -9;
      expect(index.rangeSearch([0, 0], [5, 5])).toEqual([[1, 2]]);
      expect(index.nearestNeighbor([100, 2])).toEqual([1, 2]);
    });
  });
}

checkInjectionPolicy("스텁", () => new KDTree());
