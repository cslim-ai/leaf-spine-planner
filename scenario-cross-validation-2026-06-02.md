# Leaf-Spine Planner Cross Validation

Generated at: 2026-06-01T18:19:50.579Z

## Purpose

This report compares the website calculator output with an independent oracle implementation over the same 520 scenario cases. The oracle re-enumerates possible Leaf/Spine counts and validates capacity, bandwidth, HA, Custom, Multi-planar, Multi-pods, and spare-port constraints without reading the website result fields.

## Summary

- Total compared cases: 520
- Matching cases: 520
- Mismatches: 0
- Website feasible / infeasible: 308 / 212
- Oracle feasible / infeasible: 308 / 212

## Oracle Checks

- Exhaustively searches Leaf counts and Spine counts independently from the website result object.
- Confirms Leaf physical port usage plus requested spare ports does not exceed Leaf capacity.
- Confirms Spine physical port usage does not exceed Spine capacity.
- Confirms non-blocking and oversubscription bandwidth constraints.
- Confirms Custom Leaf/Spine count preservation.
- Confirms Multi-planar 2-plane behavior and 200G node speed floor.
- Confirms Multi-pods grouping count.

## Mismatches

No mismatches were detected between the website calculator and the independent oracle.

## Comparison Samples

| ID | Profile | Nodes | Ports/Node | Node Speed | Switch Speed | Website | Oracle |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Auto non-blocking native | 8 | 1 | 400G | 400G | 2L/2S total 4, leaf 8+56, spine 4+60, oversub 1 | 2L/2S total 4, leaf 8+56, spine 4+60, oversub 1 |
| 15 | Auto non-blocking native | 32 | 4 | 400G | 1600G | 4L/2S total 6, leaf 40+32, spine 16+56, oversub 1 | 4L/2S total 6, leaf 40+32, spine 16+56, oversub 1 |
| 29 | Auto non-blocking native | 72 | 2 | 100G | 200G | 4L/2S total 6, leaf 54+10, spine 36+28, oversub 1 | 4L/2S total 6, leaf 54+10, spine 36+28, oversub 1 |
| 43 | Auto non-blocking native | 512 | 4 | 200G | 800G | 36L/15S total 51, leaf 72+0, spine 36+36, oversub 0.95 | 36L/15S total 51, leaf 72+0, spine 36+36, oversub 0.95 |
| 57 | Auto non-blocking native | 2048 | 8 | 800G | 10G | Infeasible: Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. 현재 Leaf는 48포트입니다. | Infeasible |
| 71 | Auto non-blocking leaf/spine twin | 72 | 2 | 10G | 200G | 2L/2S total 4, leaf 40+24, spine 4+60, oversub 0.9 | 2L/2S total 4, leaf 40+24, spine 4+60, oversub 0.9 |
| 85 | Auto non-blocking leaf/spine twin | 512 | 4 | 100G | 800G | 21L/5S total 26, leaf 62+10, spine 53+19, oversub 0.98 | 21L/5S total 26, leaf 62+10, spine 53+19, oversub 0.98 |
| 99 | Auto non-blocking leaf/spine twin | 2048 | 8 | 400G | 10G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 13,654대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있 | Infeasible |
| 113 | Oversubscription 1:3 native | 72 | 1 | 800G | 200G | 3L/2S total 5, leaf 56+8, spine 48+16, oversub 3 | 3L/2S total 5, leaf 56+8, spine 48+16, oversub 3 |
| 127 | Oversubscription 1:3 native | 512 | 4 | 10G | 800G | Infeasible: 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. | Infeasible |
| 141 | Oversubscription 1:3 native | 2048 | 8 | 200G | 10G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 2,276대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습 | Infeasible |
| 155 | Auto non-blocking with 8 spare Leaf ports | 72 | 1 | 400G | 200G | 4L/3S total 7, leaf 54+10, spine 48+16, oversub 1 | 4L/3S total 7, leaf 54+10, spine 48+16, oversub 1 |
| 169 | Auto non-blocking with 8 spare Leaf ports | 512 | 2 | 800G | 800G | 32L/16S total 48, leaf 64+8, spine 64+8, oversub 1 | 32L/16S total 48, leaf 64+8, spine 64+8, oversub 1 |
| 183 | Auto non-blocking with 8 spare Leaf ports | 2048 | 8 | 100G | 10G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 3,414대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습 | Infeasible |
| 197 | Multi-planar native switch fabric | 72 | 1 | 200G | 200G | 4L/4S total 8, leaf 54+10, spine 18+46, oversub 1 | 4L/4S total 8, leaf 54+10, spine 18+46, oversub 1 |
| 211 | Multi-planar native switch fabric | 512 | 2 | 400G | 800G | 36L/10S total 46, leaf 72+0, spine 54+18, oversub 0.95 | 36L/10S total 46, leaf 72+0, spine 54+18, oversub 0.95 |
| 225 | Multi-planar native switch fabric | 2048 | 8 | 10G | 10G | Infeasible: Multi-planar Design은 노드 연결 포트를 Twin-port Transceiver로 2분기해야 하므로 노드 연결 포트당 링크 스피드가 최소 200 Gbps 이상이어야 합니다. 현재 노드 연결 포트당 링크 스피드는 10 Gbps입니다. | Infeasible |
| 239 | Multi-planar with 64-node pods | 72 | 1 | 100G | 200G | Infeasible: Multi-planar Design은 노드 연결 포트를 Twin-port Transceiver로 2분기해야 하므로 노드 연결 포트당 링크 스피드가 최소 200 Gbps 이상이어야 합니다. 현재 노드 연결 포트당 링크 스피드는 100 Gbps입니다. | Infeasible |
| 253 | Multi-planar with 64-node pods | 512 | 2 | 200G | 800G | 32L/32S total 64, leaf 72+0, spine 8+64, oversub 1 | 32L/32S total 64, leaf 72+0, spine 8+64, oversub 1 |
| 267 | Multi-planar with 64-node pods | 2048 | 4 | 800G | 10G | Infeasible: Pod당 노드 64대 기준 구성이 불가능합니다. Plane당 노드 64대 기준 구성이 불가능합니다. Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 214대 | Infeasible |
| 281 | Custom fixed 8 Leaf / 4 Spine | 72 | 1 | 10G | 200G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 2대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | Infeasible |
| 295 | Custom fixed 8 Leaf / 4 Spine | 512 | 2 | 100G | 800G | Infeasible: Leaf 노드 다운링크 포트 부족: 노드 연결 링크 1,024개를 Leaf에 분산해도 Leaf당 최소 128개의 물리 포트가 필요합니다. 현재 Leaf는 72포트입니다. | Infeasible |
| 309 | Custom fixed 8 Leaf / 4 Spine | 2048 | 4 | 400G | 10G | Infeasible: Leaf 노드 다운링크 포트 부족: 노드 연결 링크 8,192개를 Leaf에 분산해도 Leaf당 최소 1,024개의 물리 포트가 필요합니다. 현재 Leaf는 48포트입니다. | Infeasible |
| 323 | Custom fixed 16 Leaf / 8 Spine with 8 spare | 64 | 8 | 800G | 200G | Infeasible: Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 160개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 64포트입니다. | Infeasible |
| 337 | Custom fixed 16 Leaf / 8 Spine with 8 spare | 512 | 2 | 10G | 800G | Infeasible: Leaf 노드 다운링크 포트 부족: 노드 연결 링크 1,024개를 Leaf에 분산해도 Leaf당 최소 64개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 72포트입니다. | Infeasible |
| 351 | Custom fixed 16 Leaf / 8 Spine with 8 spare | 2048 | 4 | 200G | 10G | Infeasible: Leaf 노드 다운링크 포트 부족: 노드 연결 링크 8,192개를 Leaf에 분산해도 Leaf당 최소 512개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 48포트입니다. | Infeasible |
| 365 | Auto non-blocking native | 72 | 1 | 800G | 400G | 4L/3S total 7, leaf 54+10, spine 48+16, oversub 1 | 4L/3S total 7, leaf 54+10, spine 48+16, oversub 1 |
| 379 | Auto non-blocking native | 512 | 4 | 10G | 1600G | 30L/2S total 32, leaf 71+1, spine 30+42, oversub 0.216 | 30L/2S total 32, leaf 71+1, spine 30+42, oversub 0.216 |
| 393 | Auto non-blocking native | 2048 | 8 | 200G | 100G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 512대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다 | Infeasible |
| 407 | Auto non-blocking leaf/spine twin | 72 | 1 | 400G | 400G | 2L/2S total 4, leaf 54+10, spine 36+28, oversub 1 | 2L/2S total 4, leaf 54+10, spine 36+28, oversub 1 |
| 421 | Auto non-blocking leaf/spine twin | 512 | 2 | 800G | 1600G | 16L/8S total 24, leaf 64+8, spine 64+8, oversub 1 | 16L/8S total 24, leaf 64+8, spine 64+8, oversub 1 |
| 435 | Auto non-blocking leaf/spine twin | 2048 | 8 | 100G | 100G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 256대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다 | Infeasible |
| 449 | Oversubscription 1:3 native | 72 | 1 | 200G | 400G | 2L/2S total 4, leaf 42+22, spine 6+58, oversub 3 | 2L/2S total 4, leaf 42+22, spine 6+58, oversub 3 |
| 463 | Oversubscription 1:3 native | 512 | 2 | 400G | 1600G | 16L/2S total 18, leaf 70+2, spine 48+24, oversub 2.667 | 16L/2S total 18, leaf 70+2, spine 48+24, oversub 2.667 |
| 477 | Oversubscription 1:3 native | 2048 | 8 | 10G | 100G | Infeasible: Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 9대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다.  | Infeasible |

## Raw Summary JSON

```json
{
  "total": 520,
  "matching": 520,
  "mismatches": 0,
  "webFeasible": 308,
  "webInfeasible": 212,
  "oracleFeasible": 308,
  "oracleInfeasible": 212
}
```
