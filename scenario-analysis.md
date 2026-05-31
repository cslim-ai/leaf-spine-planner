# Leaf-Spine Planner Scenario Analysis

Generated at: 2026-05-31T03:34:17.399Z

## Test Scope

- Node counts: 8, 16, 32, 64, 72, 128, 256, 288, 512, 576, 1024, 1296, 2048
- Node ports per node: 2, 4, 8
- Switch/design profiles: 13
- Total scenario cases: 507

## Overall Summary

- Feasible: 355
- Infeasible: 152
- Warning or notable cases: 264

## Profile Summary

| Profile | Total | Feasible | Infeasible | Warning cases |
|---|---:|---:|---:|---:|
| Auto 64p400 nonblocking | 39 | 27 | 12 | 23 |
| Auto 72p400 nonblocking | 39 | 30 | 9 | 15 |
| Auto 72p1600 twin nonblocking | 39 | 38 | 1 | 19 |
| Auto 144p1600 twin nonblocking | 39 | 39 | 0 | 19 |
| Auto 72p1600 leaf twin / spine no twin | 39 | 35 | 4 | 35 |
| Oversub 1:2 64p400 | 39 | 30 | 9 | 19 |
| Oversub 1:3 64p400 | 39 | 30 | 9 | 28 |
| Multi-planar 72p800 | 39 | 35 | 4 | 35 |
| Multi-pods 64-node pods 64p400 | 39 | 39 | 0 | 36 |
| Custom fixed 4L2S 64p400 | 39 | 9 | 30 | 3 |
| Custom fixed 8L4S 72p400 | 39 | 13 | 26 | 2 |
| Custom invalid high-spine 2L40S | 39 | 0 | 39 | 0 |
| Warning candidate leaf 800 node variable no twin | 39 | 30 | 9 | 30 |

## Key Findings

- Automatic profiles increase Leaf/Spine counts as node scale grows, and become infeasible when 2-tier full-mesh or port-capacity constraints cannot be satisfied.
- Custom profiles keep the user-entered Leaf/Spine counts fixed, so infeasibility appears quickly when node scale exceeds those fixed switch counts.
- Multi-planar profile keeps two planes and scales per-plane Leaf/Spine counts as node scale grows.
- Warning cases were detected for Leaf-Spine imbalance, zero spare Leaf/Spine ports, node-leaf bandwidth waste, and Leaf-Spine twin-port efficiency alternatives.

## Infeasible or Warning Case Samples

| Profile | Nodes | Ports/Node | Node Port Speed | Result | Warnings/Notable Info |
|---|---:|---:|---:|---|---|
| Auto 64p400 nonblocking | 8 | 8 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 64/64 / Spine 32/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 16 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 64/64 / Spine 32/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 16 | 8 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 32 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 64/64 / Spine 32/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 32 | 4 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 32 | 8 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 64 | 2 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 64 | 4 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 64 | 8 | 400G | 16 Leaf / 8 Spine / total 24 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 72 | 4 | 400G | 9 Leaf / 8 Spine / total 17 switches / oversub 1:1 / Leaf 64/64 / Spine 36/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 72 | 8 | 400G | 18 Leaf / 16 Spine / total 34 switches / oversub 1:1 / Leaf 64/64 / Spine 36/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 128 | 2 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 128 | 4 | 400G | 16 Leaf / 8 Spine / total 24 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 128 | 8 | 400G | 32 Leaf / 16 Spine / total 48 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 256 | 2 | 400G | 16 Leaf / 8 Spine / total 24 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 256 | 4 | 400G | 32 Leaf / 16 Spine / total 48 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 256 | 8 | 400G | 64 Leaf / 32 Spine / total 96 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 288 | 2 | 400G | 18 Leaf / 16 Spine / total 34 switches / oversub 1:1 / Leaf 64/64 / Spine 36/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 288 | 4 | 400G | 36 Leaf / 32 Spine / total 68 switches / oversub 1:1 / Leaf 64/64 / Spine 36/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 288 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 36대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 512 | 2 | 400G | 32 Leaf / 16 Spine / total 48 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 512 | 4 | 400G | 64 Leaf / 32 Spine / total 96 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 512 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 576 | 2 | 400G | 36 Leaf / 32 Spine / total 68 switches / oversub 1:1 / Leaf 64/64 / Spine 36/64 | Leaf spare ports: 0 |
| Auto 64p400 nonblocking | 576 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 36대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 576 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 72대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 1024 | 2 | 400G | 64 Leaf / 32 Spine / total 96 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 64p400 nonblocking | 1024 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 1024 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 128대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 1296 | 2 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 41대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 1296 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 81대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 1296 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 162대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 2048 | 2 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 2048 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 128대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 64p400 nonblocking | 2048 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 256대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 64포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 72 | 2 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p400 nonblocking | 72 | 4 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p400 nonblocking | 72 | 8 | 400G | 16 Leaf / 9 Spine / total 25 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 128 | 8 | 400G | 29 Leaf / 18 Spine / total 47 switches / oversub 1:1 / Leaf 72/72 / Spine 58/72 | Leaf spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p400 nonblocking | 256 | 4 | 400G | 29 Leaf / 18 Spine / total 47 switches / oversub 1:1 / Leaf 72/72 / Spine 58/72 | Leaf spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p400 nonblocking | 256 | 8 | 400G | 57 Leaf / 36 Spine / total 93 switches / oversub 1:1 / Leaf 72/72 / Spine 57/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 288 | 2 | 400G | 16 Leaf / 9 Spine / total 25 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 288 | 4 | 400G | 32 Leaf / 18 Spine / total 50 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 288 | 8 | 400G | 64 Leaf / 36 Spine / total 100 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 512 | 2 | 400G | 29 Leaf / 18 Spine / total 47 switches / oversub 1:1 / Leaf 72/72 / Spine 58/72 | Leaf spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p400 nonblocking | 512 | 4 | 400G | 57 Leaf / 36 Spine / total 93 switches / oversub 1:1 / Leaf 72/72 / Spine 57/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 512 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 57대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 576 | 2 | 400G | 32 Leaf / 18 Spine / total 50 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 576 | 4 | 400G | 64 Leaf / 36 Spine / total 100 switches / oversub 1:1 / Leaf 72/72 / Spine 64/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 576 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 64대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 1024 | 2 | 400G | 57 Leaf / 36 Spine / total 93 switches / oversub 1:1 / Leaf 72/72 / Spine 57/72 | Leaf spare ports: 0 |
| Auto 72p400 nonblocking | 1024 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 57대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 1024 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 114대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 1296 | 2 | 400G | 72 Leaf / 36 Spine / total 108 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p400 nonblocking | 1296 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 72대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 1296 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 144대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 2048 | 2 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 57대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 2048 | 4 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 114대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p400 nonblocking | 2048 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 228대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 72p1600 twin nonblocking | 72 | 4 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:1 / Leaf 72/72 / Spine 36/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 72 | 8 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 256 | 8 | 400G | 23 Leaf / 9 Spine / total 32 switches / oversub 1:1 / Leaf 68/72 / Spine 58/72 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 288 | 2 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 288 | 4 | 400G | 12 Leaf / 4 Spine / total 16 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 288 | 8 | 400G | 24 Leaf / 8 Spine / total 32 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 512 | 4 | 400G | 23 Leaf / 9 Spine / total 32 switches / oversub 1:1 / Leaf 68/72 / Spine 58/72 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 512 | 8 | 400G | 43 Leaf / 16 Spine / total 59 switches / oversub 1:1 / Leaf 72/72 / Spine 65/72 | Leaf spare ports: 0; leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 576 | 2 | 400G | 12 Leaf / 4 Spine / total 16 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 576 | 4 | 400G | 24 Leaf / 8 Spine / total 32 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 576 | 8 | 400G | 48 Leaf / 16 Spine / total 64 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p1600 twin nonblocking | 1024 | 2 | 400G | 23 Leaf / 9 Spine / total 32 switches / oversub 1:1 / Leaf 68/72 / Spine 58/72 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 1024 | 4 | 400G | 43 Leaf / 16 Spine / total 59 switches / oversub 1:1 / Leaf 72/72 / Spine 65/72 | Leaf spare ports: 0; leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 1024 | 8 | 400G | 86 Leaf / 48 Spine / total 134 switches / oversub 1:1 / Leaf 72/72 / Spine 43/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 1296 | 2 | 400G | 27 Leaf / 12 Spine / total 39 switches / oversub 1:1 / Leaf 72/72 / Spine 54/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 1296 | 4 | 400G | 54 Leaf / 24 Spine / total 78 switches / oversub 1:1 / Leaf 72/72 / Spine 54/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 1296 | 8 | 400G | 108 Leaf / 48 Spine / total 156 switches / oversub 1:1 / Leaf 72/72 / Spine 54/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 2048 | 2 | 400G | 43 Leaf / 16 Spine / total 59 switches / oversub 1:1 / Leaf 72/72 / Spine 65/72 | Leaf spare ports: 0; leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 2048 | 4 | 400G | 86 Leaf / 48 Spine / total 134 switches / oversub 1:1 / Leaf 72/72 / Spine 43/72 | Leaf spare ports: 0 |
| Auto 72p1600 twin nonblocking | 2048 | 8 | 400G | Infeasible - Spine 포트 또는 full-mesh 조건 부족: 모든 Leaf가 모든 Spine에 연결되는 기본 Leaf-Spine 조건을 만족하려면 최소 57대 이상의 Spine이 필요합니다. 현재 Spine 스위치는 Spine당 72포트를 사용할 수 있습니다. | - |
| Auto 144p1600 twin nonblocking | 64 | 8 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:0.99 / Leaf 129/144 / Spine 65/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 72 | 8 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:1 / Leaf 144/144 / Spine 72/144 | Leaf spare ports: 0 |
| Auto 144p1600 twin nonblocking | 128 | 4 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:0.99 / Leaf 129/144 / Spine 65/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 128 | 8 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:0.99 / Leaf 129/144 / Spine 129/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 256 | 2 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:0.99 / Leaf 129/144 / Spine 65/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 256 | 4 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:0.99 / Leaf 129/144 / Spine 129/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 288 | 2 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:1 / Leaf 144/144 / Spine 72/144 | Leaf spare ports: 0 |
| Auto 144p1600 twin nonblocking | 288 | 4 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:1 / Leaf 144/144 / Spine 144/144 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 288 | 8 | 400G | 12 Leaf / 4 Spine / total 16 switches / oversub 1:1 / Leaf 144/144 / Spine 144/144 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 512 | 2 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:0.99 / Leaf 129/144 / Spine 129/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 576 | 2 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:1 / Leaf 144/144 / Spine 144/144 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 576 | 4 | 400G | 12 Leaf / 4 Spine / total 16 switches / oversub 1:1 / Leaf 144/144 / Spine 144/144 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 576 | 8 | 400G | 24 Leaf / 8 Spine / total 32 switches / oversub 1:1 / Leaf 144/144 / Spine 144/144 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 1024 | 8 | 400G | 43 Leaf / 16 Spine / total 59 switches / oversub 1:0.99 / Leaf 144/144 / Spine 129/144 | Leaf spare ports: 0 |
| Auto 144p1600 twin nonblocking | 1296 | 2 | 400G | 17 Leaf / 7 Spine / total 24 switches / oversub 1:0.99 / Leaf 116/144 / Spine 94/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 1296 | 4 | 400G | 27 Leaf / 12 Spine / total 39 switches / oversub 1:1 / Leaf 144/144 / Spine 108/144 | Leaf spare ports: 0 |
| Auto 144p1600 twin nonblocking | 1296 | 8 | 400G | 55 Leaf / 19 Spine / total 74 switches / oversub 1:0.99 / Leaf 143/144 / Spine 138/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 144p1600 twin nonblocking | 2048 | 4 | 400G | 43 Leaf / 16 Spine / total 59 switches / oversub 1:0.99 / Leaf 144/144 / Spine 129/144 | Leaf spare ports: 0 |
| Auto 144p1600 twin nonblocking | 2048 | 8 | 400G | 86 Leaf / 32 Spine / total 118 switches / oversub 1:0.99 / Leaf 144/144 / Spine 129/144 | Leaf spare ports: 0 |
| Auto 72p1600 leaf twin / spine no twin | 8 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 6/72 / Spine 4/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 8 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 12/72 / Spine 8/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 8 | 8 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 24/72 / Spine 16/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 16 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 12/72 / Spine 8/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 16 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 24/72 / Spine 16/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 16 | 8 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 48/72 / Spine 32/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 32 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 24/72 / Spine 16/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 32 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 48/72 / Spine 32/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 32 | 8 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 64 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 48/72 / Spine 32/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 64 | 4 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 64 | 8 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 72 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 54/72 / Spine 36/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 72 | 4 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 72 | 8 | 400G | 6 Leaf / 4 Spine / total 10 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 128 | 2 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 128 | 4 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 128 | 8 | 400G | 13 Leaf / 8 Spine / total 21 switches / oversub 1:0.99 / Leaf 60/72 / Spine 65/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 256 | 2 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 256 | 4 | 400G | 13 Leaf / 8 Spine / total 21 switches / oversub 1:0.99 / Leaf 60/72 / Spine 65/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 256 | 8 | 400G | 23 Leaf / 15 Spine / total 38 switches / oversub 1:1 / Leaf 68/72 / Spine 69/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 288 | 2 | 400G | 6 Leaf / 4 Spine / total 10 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |

## Feasible Case Samples

| Profile | Nodes | Ports/Node | Node Port Speed | Result | Warnings/Notable Info |
|---|---:|---:|---:|---|---|
| Auto 64p400 nonblocking | 8 | 2 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 16/64 / Spine 8/64 | - |
| Auto 64p400 nonblocking | 128 | 8 | 400G | 32 Leaf / 16 Spine / total 48 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 72p400 nonblocking | 32 | 4 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 64/72 / Spine 64/72 | - |
| Auto 72p400 nonblocking | 512 | 2 | 400G | 29 Leaf / 18 Spine / total 47 switches / oversub 1:1 / Leaf 72/72 / Spine 58/72 | Leaf spare ports: 0; leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 twin nonblocking | 64 | 8 | 400G | 8 Leaf / 2 Spine / total 10 switches / oversub 1:1 / Leaf 48/72 / Spine 64/72 | - |
| Auto 72p1600 twin nonblocking | 576 | 4 | 400G | 24 Leaf / 8 Spine / total 32 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Auto 144p1600 twin nonblocking | 32 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 48/144 / Spine 16/144 | - |
| Auto 144p1600 twin nonblocking | 512 | 2 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:0.99 / Leaf 129/144 / Spine 129/144 | leaf-spine: disabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 8 | 8 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:1 / Leaf 24/72 / Spine 16/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Auto 72p1600 leaf twin / spine no twin | 256 | 4 | 400G | 13 Leaf / 8 Spine / total 21 switches / oversub 1:0.99 / Leaf 60/72 / Spine 65/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Oversub 1:2 64p400 | 8 | 4 | 400G | 2 Leaf / 2 Spine / total 4 switches / oversub 1:2 / Leaf 24/64 / Spine 8/64 | - |
| Oversub 1:2 64p400 | 256 | 2 | 400G | 13 Leaf / 5 Spine / total 18 switches / oversub 1:2 / Leaf 60/64 / Spine 52/64 | leaf-spine: enabling twin-port may reduce physical port use |
| Oversub 1:3 64p400 | 16 | 8 | 400G | 3 Leaf / 2 Spine / total 5 switches / oversub 1:2.87 / Leaf 58/64 / Spine 23/64 | leaf-spine imbalance: 7-8 links per Spine; leaf-spine: enabling twin-port may reduce physical port use |
| Oversub 1:3 64p400 | 288 | 4 | 400G | 24 Leaf / 6 Spine / total 30 switches / oversub 1:3 / Leaf 64/64 / Spine 64/64 | leaf-spine imbalance: 2-3 links per Spine; Leaf spare ports: 0; Spine spare ports: 0 |
| Multi-planar 72p800 | 64 | 2 | 800G | 4 Leaf / 4 Spine / total 8 switches / oversub 1:1 / Leaf 64/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Multi-planar 72p800 | 512 | 8 | 800G | 128 Leaf / 128 Spine / total 256 switches / oversub 1:1 / Leaf 64/72 / Spine 64/72 | leaf-spine: enabling twin-port may reduce physical port use |
| Multi-pods 64-node pods 64p400 | 32 | 8 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Multi-pods 64-node pods 64p400 | 512 | 4 | 400G | 64 Leaf / 32 Spine / total 96 switches / oversub 1:1 / Leaf 64/64 / Spine 64/64 | Leaf spare ports: 0; Spine spare ports: 0 |
| Custom fixed 4L2S 64p400 | 16 | 2 | 400G | 4 Leaf / 2 Spine / total 6 switches / oversub 1:1 / Leaf 16/64 / Spine 16/64 | - |
| Custom fixed 8L4S 72p400 | 72 | 4 | 400G | 8 Leaf / 4 Spine / total 12 switches / oversub 1:1 / Leaf 72/72 / Spine 72/72 | Leaf spare ports: 0; Spine spare ports: 0 |
| Warning candidate leaf 800 node variable no twin | 128 | 2 | 400G | 6 Leaf / 2 Spine / total 8 switches / oversub 1:0.98 / Leaf 65/72 / Spine 66/72 | node-leaf: Leaf twin-port may reduce bandwidth waste; leaf-spine: enabling twin-port may reduce physical port use |

## Validation Notes

- This report was generated by directly calling the production calculator in `assets/js/calculator.js`.
- UI-only behavior such as color rendering and dropdown state still requires browser smoke testing.
- The infeasible reason text is preserved from the calculator output.
