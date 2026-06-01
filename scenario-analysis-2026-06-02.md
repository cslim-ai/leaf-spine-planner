# Leaf-Spine Planner Scenario Analysis

Generated at: 2026-06-01T18:17:20.396Z

## Test Scope

- Total scenario cases: 520
- Node counts: 8, 16, 32, 64, 72, 128, 256, 288, 512, 576, 1024, 1296, 2048
- Node ports per node: 1, 2, 4, 8
- Node link speeds: 10G, 100G, 200G, 400G, 800G
- Switch port speeds: 10G, 100G, 200G, 400G, 800G, 1600G
- Profiles: 8

## Validation Rules

- Feasible results must keep Leaf and Spine counts at 2 or more.
- Feasible results must not exceed Leaf physical port capacity, including requested spare Leaf ports.
- Feasible results must not exceed Spine physical port capacity.
- Non-blocking results must keep oversubscription at or below 1:1.
- Oversubscribed results must not exceed the requested target ratio.
- Custom switch-count results must preserve the user-entered Leaf and Spine counts.
- Multi-planar results must force node-side Twin-port behavior and report 2 planes.
- Infeasible results must return a non-empty reason.

## Overall Summary

- Feasible: 308
- Infeasible: 212
- Validation failures: 0
- Warning or notable cases: 147

## Profile Summary

| Profile | Total | Feasible | Infeasible | Validation failures | Warning cases |
| --- | --- | --- | --- | --- | --- |
| Auto non-blocking native | 98 | 73 | 25 | 0 | 34 |
| Auto non-blocking leaf/spine twin | 84 | 66 | 18 | 0 | 24 |
| Oversubscription 1:3 native | 84 | 57 | 27 | 0 | 42 |
| Auto non-blocking with 8 spare Leaf ports | 84 | 59 | 25 | 0 | 13 |
| Multi-planar native switch fabric | 43 | 19 | 24 | 0 | 14 |
| Multi-planar with 64-node pods | 42 | 23 | 19 | 0 | 14 |
| Custom fixed 8 Leaf / 4 Spine | 43 | 7 | 36 | 0 | 6 |
| Custom fixed 16 Leaf / 8 Spine with 8 spare | 42 | 4 | 38 | 0 | 0 |

## Validation Failures

No validation failures were detected by the scenario rules.

## Feasible Samples

| ID | Profile | Nodes | Ports/Node | Node Speed | Switch Speed | Result | Warnings |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Auto non-blocking native | 8 | 1 | 400G | 400G | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 8+spare 56 / Spine 4+spare 60 | - |
| 12 | Auto non-blocking native | 32 | 4 | 400G | 200G | 8 Leaf / 4 Spine / total 12 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 | Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed |
| 23 | Auto non-blocking native | 32 | 2 | 800G | 200G | 7 Leaf / 5 Spine / total 12 / oversub 1:1 / Leaf 50+spare 14 / Spine 56+spare 8 | Node link speed may exceed effective Leaf-side link speed |
| 35 | Auto non-blocking native | 256 | 1 | 400G | 200G | 13 Leaf / 10 Spine / total 23 / oversub 1:1 / Leaf 60+spare 4 / Spine 52+spare 12 | Node link speed may exceed effective Leaf-side link speed |
| 49 | Auto non-blocking native | 1024 | 2 | 800G | 800G | 57 Leaf / 36 Spine / total 93 / oversub 1:1 / Leaf 72+spare 0 / Spine 57+spare 15 | Leaf spare ports: 0 |
| 65 | Auto non-blocking leaf/spine twin | 32 | 2 | 400G | 200G | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 40+spare 24 / Spine 64+spare 0 | Spine spare ports: 0 |
| 77 | Auto non-blocking leaf/spine twin | 256 | 1 | 200G | 200G | 8 Leaf / 4 Spine / total 12 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 | Spine spare ports: 0 |
| 91 | Auto non-blocking leaf/spine twin | 1024 | 2 | 400G | 800G | 32 Leaf / 16 Spine / total 48 / oversub 1:1 / Leaf 64+spare 8 / Spine 64+spare 8 | - |
| 107 | Oversubscription 1:3 native | 32 | 2 | 200G | 200G | 2 Leaf / 2 Spine / total 4 / oversub 1:2.909 / Leaf 43+spare 21 / Spine 11+spare 53 | Leaf-Spine links are not evenly distributed per Leaf |
| 120 | Oversubscription 1:3 native | 256 | 2 | 200G | 400G | 10 Leaf / 2 Spine / total 12 / oversub 1:2.889 / Leaf 61+spare 3 / Spine 45+spare 19 | Leaf-Spine links are not evenly distributed per Leaf |
| 135 | Oversubscription 1:3 native | 1296 | 1 | 10G | 10G | 36 Leaf / 9 Spine / total 45 / oversub 1:3 / Leaf 48+spare 0 / Spine 48+spare 0 | Leaf spare ports: 0; Spine spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf |
| 150 | Auto non-blocking with 8 spare Leaf ports | 32 | 4 | 200G | 400G | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 48+spare 16 / Spine 32+spare 32 | - |
| 163 | Auto non-blocking with 8 spare Leaf ports | 256 | 4 | 200G | 800G | 22 Leaf / 4 Spine / total 26 / oversub 1:0.979 / Leaf 59+spare 13 / Spine 66+spare 6 | - |
| 181 | Auto non-blocking with 8 spare Leaf ports | 2048 | 1 | 400G | 800G | 49 Leaf / 21 Spine / total 70 / oversub 1:1 / Leaf 63+spare 9 / Spine 49+spare 23 | - |
| 199 | Multi-planar native switch fabric | 72 | 4 | 800G | 800G | 12 Leaf / 4 Spine / total 16 / oversub 1:1 / Leaf 72+spare 0 / Spine 72+spare 0 | Leaf spare ports: 0; Spine spare ports: 0 |
| 227 | Multi-planar with 64-node pods | 8 | 2 | 200G | 200G | 4 Leaf / 4 Spine / total 8 / oversub 1:1 / Leaf 12+spare 52 / Spine 4+spare 60 | - |
| 244 | Multi-planar with 64-node pods | 128 | 4 | 200G | 100G | 32 Leaf / 16 Spine / total 48 / oversub 1:1 / Leaf 64+spare 0 / Spine 64+spare 0 | Leaf spare ports: 0; Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed |
| 262 | Multi-planar with 64-node pods | 1296 | 1 | 400G | 100G | 168 Leaf / 84 Spine / total 252 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 | Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed |
| 316 | Custom fixed 16 Leaf / 8 Spine with 8 spare | 16 | 8 | 100G | 100G | 16 Leaf / 8 Spine / total 24 / oversub 1:1 / Leaf 16+spare 48 / Spine 16+spare 48 | - |
| 360 | Auto non-blocking native | 32 | 2 | 200G | 400G | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 48+spare 16 / Spine 16+spare 48 | - |
| 371 | Auto non-blocking native | 256 | 1 | 100G | 400G | 7 Leaf / 2 Spine / total 9 / oversub 1:0.925 / Leaf 47+spare 17 / Spine 35+spare 29 | - |
| 385 | Auto non-blocking native | 1024 | 2 | 200G | 1600G | 32 Leaf / 4 Spine / total 36 / oversub 1:1 / Leaf 72+spare 0 / Spine 64+spare 8 | Leaf spare ports: 0 |
| 400 | Auto non-blocking leaf/spine twin | 32 | 1 | 10G | 200G | 2 Leaf / 2 Spine / total 4 / oversub 1:0.8 / Leaf 9+spare 55 / Spine 1+spare 63 | - |
| 411 | Auto non-blocking leaf/spine twin | 128 | 2 | 400G | 100G | 22 Leaf / 24 Spine / total 46 / oversub 1:1 / Leaf 60+spare 4 / Spine 44+spare 20 | Node link speed may exceed effective Leaf-side link speed |
| 423 | Auto non-blocking leaf/spine twin | 576 | 1 | 200G | 100G | 28 Leaf / 21 Spine / total 49 / oversub 1:1 / Leaf 63+spare 1 / Spine 56+spare 8 | Node link speed may exceed effective Leaf-side link speed |
| 437 | Oversubscription 1:3 native | 8 | 2 | 400G | 400G | 2 Leaf / 2 Spine / total 4 / oversub 1:2.667 / Leaf 11+spare 53 / Spine 3+spare 61 | Leaf-Spine links are not evenly distributed per Leaf |
| 450 | Oversubscription 1:3 native | 72 | 2 | 400G | 800G | 3 Leaf / 2 Spine / total 5 / oversub 1:3 / Leaf 56+spare 16 / Spine 12+spare 60 | - |
| 462 | Oversubscription 1:3 native | 512 | 1 | 200G | 800G | 8 Leaf / 2 Spine / total 10 / oversub 1:2.667 / Leaf 70+spare 2 / Spine 24+spare 48 | - |
| 481 | Auto non-blocking with 8 spare Leaf ports | 8 | 8 | 800G | 1600G | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 48+spare 24 / Spine 16+spare 56 | - |
| 492 | Auto non-blocking with 8 spare Leaf ports | 72 | 2 | 200G | 800G | 3 Leaf / 2 Spine / total 5 / oversub 1:1 / Leaf 60+spare 12 / Spine 18+spare 54 | - |

## Infeasible Samples

| ID | Profile | Nodes | Ports/Node | Node Speed | Switch Speed | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | Auto non-blocking native | 32 | 4 | 400G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 107대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 21 | Auto non-blocking native | 16 | 8 | 200G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 54대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 27 | Auto non-blocking native | 64 | 4 | 800G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. 현재 Leaf는 48포트입니다. |
| 33 | Auto non-blocking native | 128 | 4 | 100G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 107대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 39 | Auto non-blocking native | 288 | 2 | 400G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 480대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 40 | Auto non-blocking native | 288 | 4 | 800G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 144대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 46 | Auto non-blocking native | 576 | 4 | 100G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 36대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 47 | Auto non-blocking native | 576 | 8 | 200G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 72대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 50 | Auto non-blocking native | 1024 | 8 | 10G | 1600G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 4대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. |
| 51 | Auto non-blocking native | 1296 | 1 | 200G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 540대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 52 | Auto non-blocking native | 1296 | 2 | 400G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 162대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 53 | Auto non-blocking native | 1296 | 4 | 800G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 324대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 56 | Auto non-blocking native | 2048 | 4 | 200G | 1600G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 15대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. |
| 57 | Auto non-blocking native | 2048 | 8 | 800G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. 현재 Leaf는 48포트입니다. |
| 69 | Auto non-blocking leaf/spine twin | 64 | 4 | 400G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 214대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 70 | Auto non-blocking leaf/spine twin | 64 | 8 | 800G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 81 | Auto non-blocking leaf/spine twin | 288 | 2 | 200G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 240대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 82 | Auto non-blocking leaf/spine twin | 288 | 4 | 400G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 72대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 83 | Auto non-blocking leaf/spine twin | 288 | 8 | 800G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 144대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 87 | Auto non-blocking leaf/spine twin | 576 | 1 | 800G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. 현재 Leaf는 48포트입니다. |
| 93 | Auto non-blocking leaf/spine twin | 1296 | 1 | 100G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 270대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 94 | Auto non-blocking leaf/spine twin | 1296 | 2 | 200G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 81대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 95 | Auto non-blocking leaf/spine twin | 1296 | 4 | 400G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 162대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 96 | Auto non-blocking leaf/spine twin | 1296 | 8 | 800G | 400G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 324대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 99 | Auto non-blocking leaf/spine twin | 2048 | 8 | 400G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 13,654대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 101 | Oversubscription 1:3 native | 8 | 4 | 10G | 200G | 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 110 | Oversubscription 1:3 native | 64 | 2 | 10G | 1600G | 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 114 | Oversubscription 1:3 native | 72 | 4 | 10G | 400G | 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 117 | Oversubscription 1:3 native | 128 | 2 | 800G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 144대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 123 | Oversubscription 1:3 native | 288 | 2 | 100G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 40대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 127 | Oversubscription 1:3 native | 512 | 4 | 10G | 800G | 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 129 | Oversubscription 1:3 native | 576 | 1 | 400G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 160대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 130 | Oversubscription 1:3 native | 576 | 2 | 800G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 48대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 131 | Oversubscription 1:3 native | 576 | 8 | 10G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 3대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 137 | Oversubscription 1:3 native | 1296 | 4 | 200G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 27대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 138 | Oversubscription 1:3 native | 1296 | 8 | 400G | 400G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 54대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 140 | Oversubscription 1:3 native | 2048 | 4 | 10G | 1600G | 대역폭 조건 미충족: 목표 1:3 oversubscription 조건을 만족하는 Leaf-Spine 업링크 수를 만들 수 없습니다. |
| 141 | Oversubscription 1:3 native | 2048 | 8 | 200G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 2,276대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 147 | Auto non-blocking with 8 spare Leaf ports | 16 | 4 | 800G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 48포트입니다. |
| 153 | Auto non-blocking with 8 spare Leaf ports | 64 | 4 | 100G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 54대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 159 | Auto non-blocking with 8 spare Leaf ports | 128 | 2 | 400G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 41개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 48포트입니다. |
| 160 | Auto non-blocking with 8 spare Leaf ports | 128 | 4 | 800G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 167 | Auto non-blocking with 8 spare Leaf ports | 288 | 8 | 200G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 36대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 171 | Auto non-blocking with 8 spare Leaf ports | 576 | 1 | 200G | 10G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 240대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 48포트를 사용할 수 있습니다. |
| 172 | Auto non-blocking with 8 spare Leaf ports | 576 | 2 | 400G | 100G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 72대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 173 | Auto non-blocking with 8 spare Leaf ports | 576 | 4 | 800G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 144대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 176 | Auto non-blocking with 8 spare Leaf ports | 1024 | 4 | 200G | 1600G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 8대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. |
| 177 | Auto non-blocking with 8 spare Leaf ports | 1024 | 8 | 800G | 10G | Leaf 총 포트 부족: Leaf당 노드 다운링크와 Spine 업링크를 합산하면 최소 81개의 물리 포트가 필요합니다. Leaf당 예비 포트 8개를 별도로 남겨야 합니다. 현재 Leaf는 48포트입니다. |
| 179 | Auto non-blocking with 8 spare Leaf ports | 1296 | 4 | 100G | 200G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 41대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |
| 180 | Auto non-blocking with 8 spare Leaf ports | 1296 | 8 | 200G | 400G | Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 81대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. |

## Warning Samples

| ID | Profile | Nodes | Ports/Node | Node Speed | Switch Speed | Warnings | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | Auto non-blocking native | 8 | 8 | 400G | 400G | Leaf spare ports: 0 | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 64+spare 0 / Spine 32+spare 32 |
| 8 | Auto non-blocking native | 16 | 4 | 400G | 400G | Leaf spare ports: 0 | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 64+spare 0 / Spine 32+spare 32 |
| 9 | Auto non-blocking native | 16 | 4 | 800G | 400G | Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 |
| 11 | Auto non-blocking native | 32 | 4 | 400G | 100G | Node link speed may exceed effective Leaf-side link speed | 11 Leaf / 12 Spine / total 23 / oversub 1:1 / Leaf 60+spare 4 / Spine 44+spare 20 |
| 12 | Auto non-blocking native | 32 | 4 | 400G | 200G | Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed | 8 Leaf / 4 Spine / total 12 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 |
| 13 | Auto non-blocking native | 32 | 4 | 400G | 400G | Leaf spare ports: 0; Spine spare ports: 0 | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 64+spare 0 / Spine 64+spare 0 |
| 22 | Auto non-blocking native | 32 | 1 | 400G | 100G | Spine spare ports: 0; Node link speed may exceed effective Leaf-side link speed | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 40+spare 24 / Spine 64+spare 0 |
| 23 | Auto non-blocking native | 32 | 2 | 800G | 200G | Node link speed may exceed effective Leaf-side link speed | 7 Leaf / 5 Spine / total 12 / oversub 1:1 / Leaf 50+spare 14 / Spine 56+spare 8 |
| 26 | Auto non-blocking native | 64 | 2 | 200G | 1600G | Leaf spare ports: 0 | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 72+spare 0 / Spine 8+spare 64 |
| 31 | Auto non-blocking native | 72 | 8 | 400G | 800G | Leaf spare ports: 0; Spine spare ports: 0 | 12 Leaf / 4 Spine / total 16 / oversub 1:1 / Leaf 72+spare 0 / Spine 72+spare 0 |
| 34 | Auto non-blocking native | 128 | 8 | 200G | 100G | Node link speed may exceed effective Leaf-side link speed | 49 Leaf / 42 Spine / total 91 / oversub 1:1 / Leaf 63+spare 1 / Spine 49+spare 15 |
| 35 | Auto non-blocking native | 256 | 1 | 400G | 200G | Node link speed may exceed effective Leaf-side link speed | 13 Leaf / 10 Spine / total 23 / oversub 1:1 / Leaf 60+spare 4 / Spine 52+spare 12 |
| 36 | Auto non-blocking native | 256 | 2 | 800G | 400G | Node link speed may exceed effective Leaf-side link speed | 25 Leaf / 21 Spine / total 46 / oversub 1:1 / Leaf 63+spare 1 / Spine 50+spare 14 |
| 43 | Auto non-blocking native | 512 | 4 | 200G | 800G | Leaf spare ports: 0 | 36 Leaf / 15 Spine / total 51 / oversub 1:0.95 / Leaf 72+spare 0 / Spine 36+spare 36 |
| 44 | Auto non-blocking native | 512 | 8 | 400G | 1600G | Leaf spare ports: 0; Spine spare ports: 0 | 72 Leaf / 15 Spine / total 87 / oversub 1:0.95 / Leaf 72+spare 0 / Spine 72+spare 0 |
| 45 | Auto non-blocking native | 576 | 2 | 10G | 10G | Leaf spare ports: 0; Spine spare ports: 0 | 48 Leaf / 24 Spine / total 72 / oversub 1:1 / Leaf 48+spare 0 / Spine 48+spare 0 |
| 48 | Auto non-blocking native | 1024 | 1 | 400G | 400G | Leaf spare ports: 0; Spine spare ports: 0 | 32 Leaf / 16 Spine / total 48 / oversub 1:1 / Leaf 64+spare 0 / Spine 64+spare 0 |
| 49 | Auto non-blocking native | 1024 | 2 | 800G | 800G | Leaf spare ports: 0 | 57 Leaf / 36 Spine / total 93 / oversub 1:1 / Leaf 72+spare 0 / Spine 57+spare 15 |
| 55 | Auto non-blocking native | 2048 | 2 | 100G | 800G | Leaf spare ports: 0 | 64 Leaf / 8 Spine / total 72 / oversub 1:1 / Leaf 72+spare 0 / Spine 64+spare 8 |
| 63 | Auto non-blocking leaf/spine twin | 16 | 8 | 100G | 10G | Node link speed may exceed effective Leaf-side link speed | 32 Leaf / 40 Spine / total 72 / oversub 1:1 / Leaf 44+spare 4 / Spine 32+spare 16 |
| 64 | Auto non-blocking leaf/spine twin | 32 | 1 | 200G | 100G | Node link speed may exceed effective Leaf-side link speed | 2 Leaf / 2 Spine / total 4 / oversub 1:1 / Leaf 48+spare 16 / Spine 32+spare 32 |
| 65 | Auto non-blocking leaf/spine twin | 32 | 2 | 400G | 200G | Spine spare ports: 0 | 4 Leaf / 2 Spine / total 6 / oversub 1:1 / Leaf 40+spare 24 / Spine 64+spare 0 |
| 66 | Auto non-blocking leaf/spine twin | 32 | 4 | 800G | 400G | Spine spare ports: 0 | 8 Leaf / 4 Spine / total 12 / oversub 1:1 / Leaf 40+spare 24 / Spine 64+spare 0 |
| 73 | Auto non-blocking leaf/spine twin | 72 | 8 | 200G | 800G | Leaf spare ports: 0; Spine spare ports: 0 | 6 Leaf / 2 Spine / total 8 / oversub 1:1 / Leaf 72+spare 0 / Spine 72+spare 0 |
| 75 | Auto non-blocking leaf/spine twin | 128 | 4 | 10G | 10G | Leaf spare ports: 0 | 22 Leaf / 12 Spine / total 34 / oversub 1:1 / Leaf 48+spare 0 / Spine 44+spare 4 |
| 76 | Auto non-blocking leaf/spine twin | 128 | 8 | 100G | 100G | Leaf spare ports: 0; Spine spare ports: 0 | 32 Leaf / 16 Spine / total 48 / oversub 1:1 / Leaf 64+spare 0 / Spine 64+spare 0 |
| 77 | Auto non-blocking leaf/spine twin | 256 | 1 | 200G | 200G | Spine spare ports: 0 | 8 Leaf / 4 Spine / total 12 / oversub 1:1 / Leaf 48+spare 16 / Spine 64+spare 0 |
| 88 | Auto non-blocking leaf/spine twin | 576 | 4 | 10G | 100G | Leaf spare ports: 0 | 40 Leaf / 6 Spine / total 46 / oversub 1:0.967 / Leaf 64+spare 0 / Spine 40+spare 24 |
| 89 | Auto non-blocking leaf/spine twin | 576 | 8 | 100G | 200G | Leaf spare ports: 0 | 72 Leaf / 64 Spine / total 136 / oversub 1:1 / Leaf 64+spare 0 / Spine 36+spare 28 |
| 90 | Auto non-blocking leaf/spine twin | 1024 | 1 | 200G | 400G | Leaf spare ports: 0; Spine spare ports: 0 | 16 Leaf / 8 Spine / total 24 / oversub 1:1 / Leaf 64+spare 0 / Spine 64+spare 0 |
| 92 | Auto non-blocking leaf/spine twin | 1024 | 4 | 800G | 1600G | Leaf spare ports: 0 | 57 Leaf / 36 Spine / total 93 / oversub 1:1 / Leaf 72+spare 0 / Spine 57+spare 15 |
| 98 | Auto non-blocking leaf/spine twin | 2048 | 4 | 100G | 1600G | Leaf spare ports: 0 | 64 Leaf / 8 Spine / total 72 / oversub 1:1 / Leaf 72+spare 0 / Spine 64+spare 8 |
| 100 | Oversubscription 1:3 native | 8 | 1 | 800G | 100G | Leaf-Spine links are not evenly distributed per Leaf; Node link speed may exceed effective Leaf-side link speed | 2 Leaf / 2 Spine / total 4 / oversub 1:2.909 / Leaf 15+spare 49 / Spine 11+spare 53 |
| 102 | Oversubscription 1:3 native | 8 | 8 | 100G | 400G | Leaf-Spine links are not evenly distributed per Leaf | 2 Leaf / 2 Spine / total 4 / oversub 1:2.667 / Leaf 35+spare 29 / Spine 3+spare 61 |
| 105 | Oversubscription 1:3 native | 16 | 8 | 10G | 10G | Leaf-Spine links are not evenly distributed per Leaf | 4 Leaf / 2 Spine / total 6 / oversub 1:2.909 / Leaf 43+spare 5 / Spine 22+spare 26 |
| 107 | Oversubscription 1:3 native | 32 | 2 | 200G | 200G | Leaf-Spine links are not evenly distributed per Leaf | 2 Leaf / 2 Spine / total 4 / oversub 1:2.909 / Leaf 43+spare 21 / Spine 11+spare 53 |
| 108 | Oversubscription 1:3 native | 32 | 4 | 400G | 400G | Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 3 Leaf / 2 Spine / total 5 / oversub 1:2.867 / Leaf 58+spare 6 / Spine 23+spare 41 |
| 111 | Oversubscription 1:3 native | 64 | 4 | 200G | 10G | Spine spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine; Node link speed may exceed effective Leaf-side link speed | 43 Leaf / 36 Spine / total 79 / oversub 1:3 / Leaf 46+spare 2 / Spine 48+spare 0 |
| 112 | Oversubscription 1:3 native | 64 | 8 | 400G | 100G | Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine; Node link speed may exceed effective Leaf-side link speed | 19 Leaf / 11 Spine / total 30 / oversub 1:3 / Leaf 63+spare 1 / Spine 63+spare 1 |
| 113 | Oversubscription 1:3 native | 72 | 1 | 800G | 200G | Node link speed may exceed effective Leaf-side link speed | 3 Leaf / 2 Spine / total 5 / oversub 1:3 / Leaf 56+spare 8 / Spine 48+spare 16 |
| 115 | Oversubscription 1:3 native | 72 | 8 | 100G | 800G | Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 9 Leaf / 2 Spine / total 11 / oversub 1:2.667 / Leaf 67+spare 5 / Spine 14+spare 58 |
| 116 | Oversubscription 1:3 native | 128 | 1 | 200G | 1600G | Leaf-Spine links are not evenly distributed per Leaf | 2 Leaf / 2 Spine / total 4 / oversub 1:2.667 / Leaf 67+spare 5 / Spine 3+spare 69 |
| 118 | Oversubscription 1:3 native | 128 | 8 | 10G | 100G | Leaf spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 17 Leaf / 2 Spine / total 19 / oversub 1:2.033 / Leaf 64+spare 0 / Spine 26+spare 38 |
| 119 | Oversubscription 1:3 native | 256 | 1 | 100G | 200G | Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 5 Leaf / 2 Spine / total 7 / oversub 1:2.889 / Leaf 61+spare 3 / Spine 23+spare 41 |
| 120 | Oversubscription 1:3 native | 256 | 2 | 200G | 400G | Leaf-Spine links are not evenly distributed per Leaf | 10 Leaf / 2 Spine / total 12 / oversub 1:2.889 / Leaf 61+spare 3 / Spine 45+spare 19 |
| 121 | Oversubscription 1:3 native | 256 | 4 | 400G | 800G | Leaf spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 17 Leaf / 3 Spine / total 20 / oversub 1:2.773 / Leaf 72+spare 0 / Spine 63+spare 9 |
| 122 | Oversubscription 1:3 native | 256 | 8 | 800G | 1600G | Leaf spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine | 34 Leaf / 6 Spine / total 40 / oversub 1:2.773 / Leaf 72+spare 0 / Spine 63+spare 9 |
| 124 | Oversubscription 1:3 native | 288 | 4 | 200G | 100G | Leaf spare ports: 0; Node link speed may exceed effective Leaf-side link speed | 31 Leaf / 13 Spine / total 44 / oversub 1:2.923 / Leaf 64+spare 0 / Spine 62+spare 2 |
| 125 | Oversubscription 1:3 native | 288 | 8 | 400G | 200G | Leaf spare ports: 0; Spine spare ports: 0; Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine; Node link speed may exceed effective Leaf-side link speed | 61 Leaf / 25 Spine / total 86 / oversub 1:2.923 / Leaf 64+spare 0 / Spine 64+spare 0 |
| 126 | Oversubscription 1:3 native | 512 | 1 | 800G | 400G | Leaf-Spine links are not evenly distributed per Leaf; Leaf-Spine links are not evenly distributed per Spine; Node link speed may exceed effective Leaf-side link speed | 14 Leaf / 6 Spine / total 20 / oversub 1:2.96 / Leaf 62+spare 2 / Spine 59+spare 5 |

## Raw Summary JSON

```json
{
  "summary": {
    "total": 520,
    "feasible": 308,
    "infeasible": 212,
    "failedValidation": 0,
    "warningCases": 147
  },
  "coverage": {
    "nodePortCounts": [
      1,
      2,
      4,
      8
    ],
    "nodeSpeeds": [
      10,
      100,
      200,
      400,
      800
    ],
    "switchSpeeds": [
      10,
      100,
      200,
      400,
      800,
      1600
    ],
    "nodeCounts": [
      8,
      16,
      32,
      64,
      72,
      128,
      256,
      288,
      512,
      576,
      1024,
      1296,
      2048
    ]
  },
  "profileSummary": [
    {
      "profile": "Auto non-blocking native",
      "total": 98,
      "feasible": 73,
      "infeasible": 25,
      "failedValidation": 0,
      "warnings": 34
    },
    {
      "profile": "Auto non-blocking leaf/spine twin",
      "total": 84,
      "feasible": 66,
      "infeasible": 18,
      "failedValidation": 0,
      "warnings": 24
    },
    {
      "profile": "Oversubscription 1:3 native",
      "total": 84,
      "feasible": 57,
      "infeasible": 27,
      "failedValidation": 0,
      "warnings": 42
    },
    {
      "profile": "Auto non-blocking with 8 spare Leaf ports",
      "total": 84,
      "feasible": 59,
      "infeasible": 25,
      "failedValidation": 0,
      "warnings": 13
    },
    {
      "profile": "Multi-planar native switch fabric",
      "total": 43,
      "feasible": 19,
      "infeasible": 24,
      "failedValidation": 0,
      "warnings": 14
    },
    {
      "profile": "Multi-planar with 64-node pods",
      "total": 42,
      "feasible": 23,
      "infeasible": 19,
      "failedValidation": 0,
      "warnings": 14
    },
    {
      "profile": "Custom fixed 8 Leaf / 4 Spine",
      "total": 43,
      "feasible": 7,
      "infeasible": 36,
      "failedValidation": 0,
      "warnings": 6
    },
    {
      "profile": "Custom fixed 16 Leaf / 8 Spine with 8 spare",
      "total": 42,
      "feasible": 4,
      "infeasible": 38,
      "failedValidation": 0,
      "warnings": 0
    }
  ]
}
```
