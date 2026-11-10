/**
 * `trie/ahoCorasick` 실습 채점 — 스텁 `./ahoCorasick.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./ahoCorasick.contract.ts` 에, 계약 자체는 `./ahoCorasick.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/trie/ahoCorasick/_reference/ahoCorasick.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { describe, expect, test } from "bun:test";
import { runContract } from "../../_contract/runContract";
import { AhoCorasick } from "./ahoCorasick";
import {
  type AhoCorasickContract,
  ahoCorasickContract,
  entries,
  Reindexable,
} from "./ahoCorasick.contract";

runContract(
  () => new Reindexable((patterns) => new AhoCorasick(patterns)),
  ahoCorasickContract,
  { label: "스텁" },
);

/**
 * 주입 정책은 계약의 일부다(규약1). 넘긴 패턴 배열 · 돌려받은 `Map` 과 배열을 붙들지 않는다는 약속은 호출자 쪽 값을 고쳐 봐야
 * 드러나므로 참조 모델 대조(축1)가 담지 못한다. 코드 단위로 센다는 조항도 여기서 본다 — 축1 무작위 시퀀스는 `a`·`b`·`c` 만 쓴다.
 */
function checkInjectionPolicy(
  label: string,
  make: (patterns: string[]) => AhoCorasickContract,
): void {
  describe(`AhoCorasick 주입 정책 [${label}]`, () => {
    test("생성자가 돌아온 뒤 호출자가 패턴 배열을 고쳐도 답은 그대로다", () => {
      const given = ["he", "she"];
      const index = make(given);
      given[0] = "xyz";
      given.push("ushers");
      expect(entries(index.search("ushers"))).toEqual([
        ["he", [2]],
        ["she", [1]],
      ]);
    });

    test("돌려받은 Map 과 배열을 고쳐도 다음 검색의 답은 그대로다", () => {
      const index = make(["ab"]);
      const first = index.search("abab");
      first.get("ab")?.push(99);
      first.set("zz", [0]);
      expect(entries(index.search("abab"))).toEqual([["ab", [0, 2]]]);
    });

    test("길이와 자리는 코드 단위로 센다 — 대리 쌍 문자는 두 칸이다", () => {
      const index = make(["😀", "a"]);
      expect(entries(index.search("a😀a😀"))).toEqual([
        ["a", [0, 3]],
        ["😀", [1, 4]],
      ]);
    });
  });
}

checkInjectionPolicy("스텁", (patterns) => new AhoCorasick(patterns));
