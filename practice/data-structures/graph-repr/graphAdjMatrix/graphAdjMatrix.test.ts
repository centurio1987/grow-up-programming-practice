/**
 * `graph-repr/graphAdjMatrix` 실습 채점 — 스텁 `./graphAdjMatrix.ts` 를 계약 스위트로 돈다.
 *
 * **실패하는 것이 정상이다**(미구현). `ci.ts practice` 가 이 파일들을 돌리고 판정에서 뺀다.
 * 무엇을 검사하는지는 `./graphAdjMatrix.contract.ts` 에, 계약 자체는 `./graphAdjMatrix.ts` 헤더 한 곳에 있다.
 * 정본 실행은 `guides/data-structures/graph-repr/graphAdjMatrix/_reference/graphAdjMatrix.test.ts` 에 있다(KAN-075 `S2` 에서 갈랐다).
 */

import { runContract } from "../../_contract/runContract";
import { GraphAdjMatrix } from "./graphAdjMatrix";
import { graphAdjMatrixContract, SizedGraphs } from "./graphAdjMatrix.contract";

runContract(
  () => new SizedGraphs((n, directed) => new GraphAdjMatrix(n, directed)),
  graphAdjMatrixContract,
  { label: "스텁" },
);
