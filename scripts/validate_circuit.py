#!/usr/bin/env python3
"""2026 archival XML check. Not an electrical/functionality simulator."""
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
original_path = ROOT / "archive/kim_hahyeong_original.circ"
run_path = ROOT / "circuit/mukjjippa-main.circ"
raw = original_path.read_bytes()
modified = run_path.read_bytes()
before = b'<main name="RPS_Reference_rip"/>'
after = b'<main name="Main"/>'
assert raw.count(before) == 1, "Expected one original main selector"
assert modified == raw.replace(before, after, 1), "Curated copy changes more than main selector"

for label, data, expected_main in [
    ("original", raw, "RPS_Reference_rip"),
    ("run", modified, "Main"),
]:
    project = ET.fromstring(data)
    circuits = project.findall("circuit")
    names = [c.attrib["name"] for c in circuits]
    assert len(names) == 27, f"{label}: unexpected circuit count"
    assert len(names) == len(set(names)), f"{label}: duplicate circuit names"
    assert "Main" in names
    assert project.find("main").attrib["name"] == expected_main
    assert project.attrib.get("source") == "3.9.0"
    used = {comp.attrib["name"] for c in circuits for comp in c.findall("comp") if "lib" not in comp.attrib}
    assert used.issubset(names), f"{label}: undefined subcircuits {used - set(names)}"
    print(f"PASS: {label}, {len(names)} circuit definitions, entry={expected_main}, internal references resolved")
print("PASS: curated file differs from submitted original only by main selector")
print("NOTE: Full circuit simulation and game logic are NOT verified by this check")
